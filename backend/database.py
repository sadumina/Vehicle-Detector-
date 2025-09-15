from motor.motor_asyncio import AsyncIOMotorClient
import urllib.parse

# --- MongoDB Atlas Credentials ---
username = "sbr_db_user"
password = urllib.parse.quote("Sadumina#2003")  # encodes '#' -> '%23'

MONGO_URL = (
    f"mongodb+srv://{username}:{password}"
    "@vd.famuusn.mongodb.net/?retryWrites=true&w=majority&appName=VD"
)

# --- Initialize client ---
client = AsyncIOMotorClient(MONGO_URL)

# --- Database reference ---
db = client.vehicleDB   # use your DB name here (e.g. "vehicleDB")

# --- Helper function to get collection ---
def get_collection(name: str):
    return db[name]
