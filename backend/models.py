from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Input schema for creating a vehicle entry
class VehicleIn(BaseModel):
    vehicleNo: str

# Output schema for returning vehicle data
class VehicleOut(BaseModel):
    id: str
    vehicleNo: str
    inTime: datetime
    outTime: Optional[datetime] = None
    status: str
