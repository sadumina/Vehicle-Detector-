from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from database import db

router = APIRouter()

# Helper to convert MongoDB documents into JSON
def vehicle_serializer(vehicle) -> dict:
    return {
        "id": str(vehicle["_id"]),
        "vehicleNo": vehicle["vehicleNo"],
        "inTime": vehicle["inTime"],
        "outTime": vehicle.get("outTime"),
        "status": vehicle["status"]
    }

# 🚚 Vehicle Entry
@router.post("/entry")
async def create_entry(data: dict):
    new_vehicle = {
        "vehicleNo": data["vehicleNo"],
        "inTime": datetime.utcnow(),
        "outTime": None,
        "status": "inside"
    }
    result = await db.vehicles.insert_one(new_vehicle)
    created = await db.vehicles.find_one({"_id": result.inserted_id})
    return vehicle_serializer(created)

# 🚪 Vehicle Exit
@router.put("/exit/{vehicle_id}")
async def mark_exit(vehicle_id: str):
    vehicle = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    await db.vehicles.update_one(
        {"_id": ObjectId(vehicle_id)},
        {"$set": {"outTime": datetime.utcnow(), "status": "exited"}}
    )
    updated = await db.vehicles.find_one({"_id": ObjectId(vehicle_id)})
    return vehicle_serializer(updated)

# 📊 Get All Vehicles
@router.get("/")
async def get_vehicles():
    vehicles = []
    async for v in db.vehicles.find().sort("inTime", -1):
        vehicles.append(vehicle_serializer(v))
    return vehicles
