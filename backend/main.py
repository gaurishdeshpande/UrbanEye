from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.routers import projects, geo

app = FastAPI(
    title="UrbanEye API",
    description="Backend API for the UrbanEye environmental simulation platform.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router)
app.include_router(geo.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the UrbanEye API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
