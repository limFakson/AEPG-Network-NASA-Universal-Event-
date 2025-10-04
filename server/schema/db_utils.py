from datetime import datetime
from prisma import Prisma

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
        return updated
    else:
        # Insert a new record
        new_fire = await db.mapfires.create(data=kwargs)
        print(f"✅ Inserted New Fire Record ID: {new_fire.id}")
        await db.disconnect()
        return new_fire


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
