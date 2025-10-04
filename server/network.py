import os
import json
import httpx
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

FIRMS_API_URL=os.getenv("FIRMS_API_URL")

def firms_data(area:str="world", day_range:int=1, date:datetime=datetime.now(), source:str="LANDSAT_NRT"):
    with httpx.Client() as client:
        response = client.get(FIRMS_API_URL, timeout=30)
        response.raise_for_status()
    
    with open("firm_data.csv", 'w') as f:
        f.write(response.text)
    
    return

firms_data()