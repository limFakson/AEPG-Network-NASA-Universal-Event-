import os
import logging

# === Ensure logs directory exists ===
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

# === Log file path ===
LOG_FILE = os.path.join(log_dir, "nasa_app_server.log")

# === Create file handler ===
handler = logging.FileHandler(LOG_FILE, mode="a", encoding="utf-8")

# === Formatter (includes thread name) ===
formatter = logging.Formatter(
    "%(asctime)s [%(levelname)s] %(threadName)s %(name)s: %(message)s",
    "%Y-%m-%d %H:%M:%S",
)
handler.setFormatter(formatter)

# === Optional console output ===
console_handler = logging.StreamHandler()
console_handler.setFormatter(formatter)

# === Configure root logger globally ===
root_logger = logging.getLogger()
root_logger.setLevel(logging.INFO)

# Remove existing handlers to prevent duplicate logs
root_logger.handlers.clear()

# Add handlers for file and console output
root_logger.addHandler(handler)
root_logger.addHandler(console_handler)

# === Silence noisy libraries ===
logging.getLogger("apscheduler").setLevel(logging.ERROR)
logging.getLogger("prisma").setLevel(logging.ERROR)
logging.getLogger("uvicorn").setLevel(logging.WARNING)

# === Application logger ===
logger = logging.getLogger("server")
logger.info("🚀 AEPG Network logger started.")

# === Example log messages ===
logger.debug("This is a DEBUG message (won't appear at INFO level).")
logger.info("Server is starting up...")
logger.warning("This is a WARNING message.")
logger.error("This is an ERROR message.")
