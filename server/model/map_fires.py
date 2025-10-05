from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from .weather_obs import WeatherObservationBase

class MapFireBase(BaseModel):
    id: int
    latitude: float
    longitude: float
    confidence: float
    confidence_lvl: str = Field(str, max_length=16, description="High, Medium or Low indicated by 'H', 'M or 'L'") 
    satellite: str
    acq_datetime: datetime
    daynight: str = Field(str, max_length=16, description="day or night indicated by 'D' or 'N'")    # "D" or "N"
    geom_wkt: str
    
    # 🔹 Nest weather data as a list, because one fire can have many observations
    weather: Optional[List[WeatherObservationBase]] = None
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True 
        
        # Convert datetime to a nice human-readable string
        json_encoders = {
            datetime: lambda v: v.strftime("%b %d, %Y %H:%M UTC") if v else None
        }