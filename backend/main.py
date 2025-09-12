from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import vehicles
from database import db

app = FastAPI(title="Vehicle Detector API")

# ✅ Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include routes
app.include_router(vehicles.router, prefix="/api/vehicles")

@app.on_event("startup")
async def startup_db_check():
    try:
        # Run a test query
        await db.command("ping")
        print("✅ MongoDB Connected Successfully")
    except Exception as e:
        print("❌ MongoDB Connection Failed:", e)

@app.get("/")
def root():
    return {"message": "🚀 Vehicle Detector API running!"}
