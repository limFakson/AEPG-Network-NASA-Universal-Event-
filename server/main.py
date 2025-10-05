from dotenv import load_dotenv
load_dotenv() # load env before other dependencies or files

from fastapi import Response, FastAPI, HTTPException, Request, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
import json

from server.config.logging import logger
from server.services.SchedulerService import jobstores, scheduler
from server.model.map_fires import MapFireBase
from server.model.weather_obs import WeatherObservationBase
from server.schema.db_utils import get_fire_records, retrieve_weather_data

app = FastAPI(title="AEPG Network Server")

# Enable CORS for frontend (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    await jobstores()

@app.on_event("shutdown")
async def shutdown():
    await scheduler.shutdown()

@app.get("/api/detect/fire", response_model=List[MapFireBase])
async def fetch_fire_detected(filter:Optional[str]=Query(None)):
    firm_data = await get_fire_records()
    
    return firm_data

@app.get("/api/detect/power", response_model=List[WeatherObservationBase])
async def fetch_power_data(fire:Optional[int]=Query(None)):
    if fire is None:
        pws_data = await retrieve_weather_data()
    else:
        pws_data = await retrieve_weather_data(fire)
    
    return pws_data