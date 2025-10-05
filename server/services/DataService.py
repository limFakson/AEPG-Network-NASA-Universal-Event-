import os, sys
import asyncio
import logging
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))

import pandas as pd
from shapely.geometry import Point
from schema.db_utils import save_fire_record, ingest_weather_data
from datetime import datetime, timedelta
from asgiref.sync import async_to_sync
from ..network import power_for_point

logger = logging.getLogger(__name__)

def _parse_acq_datetime(df: pd.DataFrame) -> pd.Series:
    """
    Combine acq_date (YYYY-MM-DD) and acq_time (e.g. '1513') into timezone-aware UTC datetime.
    Handles acq_time values missing leading zeros by zfill(4).
    Returns a pandas Series of datetimes (UTC). Invalid rows become NaT.
    """
    # Ensure strings
    df['acq_date'] = df['acq_date'].astype(str)
    df['acq_time'] = df['acq_time'].astype(str).str.zfill(4)  # '813' -> '0813', '1513' -> '1513'
    time_str = df['acq_time'].str.slice(0, 2) + ':' + df['acq_time'].str.slice(2, 4)
    combined = df['acq_date'] + ' ' + time_str
    # parse; errors -> NaT
    parsed = pd.to_datetime(combined, format='%Y-%m-%d %H:%M', errors='coerce', utc=True)
    return parsed

HOURS_WINDOW = 3 
POWER_PARAMS = ["T2M","WS2M","RH2M","PRECTOTCORR"]

class FirmsDataService():
    def __init__(self):
        self.pws = PowerWeatherService()
        self.data_file = "firm_data.csv"
    
    async def process(self):
        self.df = pd.read_csv(self.data_file)
        
        # --- 🧹 Clean and Normalize ---
        confidence_map = {"L": 0.3, "M": 0.6, "H": 0.9}
        self.df["confidence_num"] = self.df["confidence"].map(confidence_map)
        
        # parse datetime
        self.df['acq_datetime'] = _parse_acq_datetime(self.df)
        before = len(self.df)
        self.df = self.df.dropna(subset=['acq_datetime'])
        logger.info("Dropped %d rows with invalid date/time", before - len(self.df))
        
        self.df["geom_wkt"] = self.df.apply(
            lambda row: Point(row["longitude"], row["latitude"]).wkt, axis=1
        )
         
        # --- filter out non north america data ----
        self.df_filtered = await self.region_filter()
        
        
        # Optionally, filter by confidence threshold (e.g., only medium/high)
        # df_filtered = df_filtered[df_filtered["confidence"].isin(["M", "H"])]
        
        # Drop duplicates
        self.df_filtered.drop_duplicates(subset=["latitude", "longitude", "acq_datetime"], inplace=True)
        
        await self.save_transformed()
        logger.info("Process Done")
    
    async def region_filter(self):
        # --- 🌎 Filter for North America ---
        lat_min, lat_max = 5, 83
        lon_min, lon_max = -168, -52

        df_filtered = self.df[
            (self.df["latitude"].between(lat_min, lat_max)) &
            (self.df["longitude"].between(lon_min, lon_max))
        ]
        
        return df_filtered
    
    async def save_transformed(self):
        for _,row in self.df_filtered.iterrows():
            record_id = await save_fire_record(
                latitude=row["latitude"],
                longitude=row["longitude"],
                confidence=row["confidence_num"],
                confidence_lvl=row["confidence"],
                satellite=row["satellite"],
                acq_datetime=row["acq_datetime"],
                daynight=row["daynight"],
                geom_wkt=row["geom_wkt"]
            )
            
            await self.pws.process(record_id, row["latitude"], row["longitude"], row["acq_datetime"])
        
        print(f"✅ Inserted {len(self.df_filtered)} North America fire detections into database.")


class PowerWeatherService():
    def __init__(self):
        self.init = None
    
    async def process(self, fire_id:int, lat:float, lon:float, acq:datetime):
        start_dt = (acq - timedelta(hours=HOURS_WINDOW)).replace(minute=0, second=0, microsecond=0)
        end_dt = (acq + timedelta(hours=HOURS_WINDOW)).replace(minute=0, second=0, microsecond=0)
        
        termporal = "hourly"
        
        self.power_data = await power_for_point(lat, lon, start_dt, end_dt, termporal)
        all_obs = await self.transform_fetched()
        
        # Save transformed obs
        await self.save_transform(fire_id, all_obs)
        
    async def transform_fetched(self):
        all_obs = []
        properties = self.power_data.get("properties", {})
        parameters = properties.get("parameter", {})

        # parse each requested parameter and build WeatherObservation rows
        # We'll iterate over timestamps present in any parameter
        timestamps = set()
        for p in POWER_PARAMS:
            param_map = parameters.get(p, {})
            timestamps.update(param_map.keys())

            for ts in timestamps:
                # parse timestamp strings from NASA POWER keys; hourly format: YYYYMMDDHH
                # We'll parse to UTC datetime
                try:
                    obs_time = datetime.strptime(ts, "%Y%m%d%H").replace(tzinfo=datetime.timezone.utc)  # careful with tz
                except Exception:
                    # try daily fallback YYYYMMDD
                    try:
                        obs_time = datetime.strptime(ts, "%Y%m%d").replace(tzinfo=datetime.timezone.utc)
                    except Exception:
                        logger.debug("Unrecognized timestamp format from POWER: %s", ts)
                        continue

                for p in POWER_PARAMS:
                    val = parameters.get(p, {}).get(ts)
                    if val is None:
                        continue
                    # units are not always included in this simplified response; store simple unit hints
                    unit_hint = {
                        "T2M": "degC",
                        "WS2M": "m/s",
                        "RH2M": "%",
                        "PRECTOTCORR": "mm"
                    }.get(p, None)
                    
                    obs = {
                        "obs_time": obs_time,
                        "parameter": p,
                        "value": float(val) if val is not None else None,
                        "units": unit_hint,
                        "source": "NASA_POWER"                        
                    }                    
                    all_obs.append(obs)
        
    async def save_transform(self, fire_id, all_obs):
        await ingest_weather_data(fire_id, all_obs)
        logger.info("Inserting %d weather observations", len(all_obs))