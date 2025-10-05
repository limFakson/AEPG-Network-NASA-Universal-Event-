from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# 🔹 Shared fields
class WeatherObservationBase(BaseModel):
    id:int
    fire_id: int = Field(..., description="ID of the related fire record")
    obs_time: datetime = Field(..., description="Observation timestamp (UTC)")
    parameter: str = Field(..., max_length=64, description="Weather parameter e.g., T2M, WS2M")
    value: Optional[float] = Field(None, description="Observed value")
    units: Optional[str] = Field(None, max_length=16, description="Units of measurement")
    source: Optional[str] = Field(default="NASA_POWER", max_length=64, description="Data source")
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        from_attributes = True 
        
        # Convert datetime to a nice human-readable string
        json_encoders = {
            datetime: lambda v: v.strftime("%b %d, %Y %H:%M UTC") if v else None
        }