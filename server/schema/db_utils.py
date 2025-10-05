from datetime import datetime
from prisma import Prisma
from typing import Optional, List

db = Prisma()

async def db_disconnect():
    await db.disconnect()
    
    return

async def save_fire_record(**kwargs):
    """
    Insert or update a fire record in the MapFires table.
    
    Usage:
        await save_fire_record(latitude=34.0, longitude=-118.2, confidence=80.5, ...)
    """
    await db.connect()

    record_id = kwargs.pop("id", None)

    if record_id:
        # Update existing record
        updated = await db.mapfires.update(
            where={"id": record_id},
            data=kwargs
        )
        print(f"✅ Updated Fire Record ID: {updated.id}")
        await db.disconnect()
        return updated.id
    else:
        # Insert a new record
        new_fire = await db.mapfires.create(data=kwargs)
        print(f"✅ Inserted New Fire Record ID: {new_fire.id}")
        await db.disconnect()
        return new_fire.id


async def get_fire_records(**filters):
    """
    Retrieve fire records from MapFires table with optional filters.
    
    Usage:
        await get_fire_records(confidence_lvl="H")
        await get_fire_records()  # gets all
    """
    await db.connect()
    records = await db.mapfires.find_many(where=filters)
    await db.disconnect()
    return records

async def ingest_weather_data(
    fire_id: int,
    observations: List[dict]
) -> List[dict]:
    """
    Save multiple weather observations for a specific fire detection.
    Each item in `observations` must include:
      - obs_time (datetime)
      - parameter (str)
      - value (float | None)
      - units (str | None)
      - source (str | default: "NASA_POWER")
    """

    await db.connect()
    saved_records = []

    for obs in observations:
        record = await db.weatherobservation.create(
            data={
                "fire_id": fire_id,
                "obs_time": obs.get("obs_time", datetime.utcnow()),
                "parameter": obs["parameter"],
                "value": obs.get("value"),
                "units": obs.get("units"),
                "source": obs.get("source", "NASA_POWER"),
            }
        )
        print(f"✅ Inserted New Weather Record ID {record.id} for Fire ID: {fire_id}")
        saved_records.append(record)

    await db.disconnect()
    return saved_records


async def retrieve_weather_data(
    fire_id: Optional[int] = None
) -> List[dict]:
    """
    Retrieve weather observations.
    - If fire_id is provided → fetch only that fire’s observations.
    - Otherwise → fetch all weather data.
    """

    await db.connect()

    if fire_id is not None:
        records = await db.weatherobservation.find_many(
            where={"fire_id": fire_id},
            order={"obs_time": "asc"},
        )
    else:
        records = await db.weatherobservation.find_many(
            order={"obs_time": "asc"},
        )

    await db.disconnect()
    return records