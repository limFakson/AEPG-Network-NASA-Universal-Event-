import logging
import pytz
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from server.network import firms_data
from server.services.DataService import FirmsDataService

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler()

async def firms_pipeline():
    print("🚀 Running FIRMS pipeline job (async)")
    await firms_data()
    
    await FirmsDataService().process()
    
async def jobstores():
    scheduler.add_job(
        firms_pipeline,
        CronTrigger(hour="4,21", timezone=pytz.UTC),
        id="start_firm_pipeline_job"
    )
    scheduler.start()
    logger.info("Scheduler started with jobs.")