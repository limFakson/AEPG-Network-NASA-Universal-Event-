import os, sys
import asyncio
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../")))
import pandas as pd
from shapely.geometry import Point
from schema.db_utils import save_fire_record
from asgiref.sync import async_to_sync

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

class FirmsDataService():
    def __init__(self):
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
        print("Dropped %d rows with invalid date/time", before - len(self.df))
        
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
        print("Process Done")
    
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
            await save_fire_record(
                latitude=row["latitude"],
                longitude=row["longitude"],
                confidence=row["confidence_num"],
                confidence_lvl=row["confidence"],
                satellite=row["satellite"],
                acq_datetime=row["acq_datetime"],
                daynight=row["daynight"],
                geom_wkt=row["geom_wkt"]
            )
        
        print(f"✅ Inserted {len(self.df_filtered)} North America fire detections into database.")
        