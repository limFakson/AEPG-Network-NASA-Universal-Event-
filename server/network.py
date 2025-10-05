import os
import json
import httpx
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

FIRMS_API_URL=os.getenv("FIRMS_API_URL")
POWER_API_URL=os.getenv("POWER_API_URL")
POWER_PARAMS = ["T2M","WS2M","RH2M","PRECTOTCORR"]
COMMUNITY = "ag"

async def firms_data(area:str="world", day_range:int=1, date:datetime=datetime.now(), source:str="LANDSAT_NRT"):
    with await httpx.AsyncClient() as client:
        response = await client.get(FIRMS_API_URL, timeout=30)
        await response.raise_for_status()

        resp = await response.text
    with open("firm_data.csv", 'w') as f:
        f.write(resp)
    
    return

async def power_for_point(lat: float, lon: float, start_date: str, end_date: str, temporal: str = "hourly"):
    params = {
        "parameters": ",".join(POWER_PARAMS),
        "start": start_date,
        "end": end_date,
        "latitude": lat,
        "longitude": lon,
        "community": COMMUNITY,
        "format": "JSON"
    }
    with await httpx.AsyncClient() as client:
        response = await client.get(POWER_API_URL, params=params, timeout=30)
        await response.raise_for_status()

        resp = await response.json()
        
    return resp
    
    