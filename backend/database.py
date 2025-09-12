from motor.motor_asyncio import AsyncIOMotorClient
import urllib.parse

# Encode password safely
username = "sbr_db_user"
password = urllib.parse.quote("Sadumina#2003")  # turns # into %23

# Replace "cluster0" with your actual cluster name from Atlas
MONGO_URL = f"mongodb+srv://{username}:{password}@cluster0.famuusn.mongodb.net/?retryWrites=true&w=majority&appName=VD"

client = AsyncIOMotorClient(MONGO_URL)
db = client.vehicleDB  # database name
