from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MapFireBase(BaseModel):
    id: int
    latitude: float
    longitude: float
    confidence: float
    confidence_lvl: str      
    satellite: str
    acq_datetime: datetime
    daynight: str             # "D" or "N"
    geom_wkt: str
    createdAt: datetime
    updatedAt: datetime

    class Config:
        orm_mode = True 