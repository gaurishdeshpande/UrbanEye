from pydantic import BaseModel, Field
from typing import Optional

class ProjectCreate(BaseModel):
    name: str = Field(..., description="Name of the project")
    description: Optional[str] = None
    lat: float
    lon: float
    radius_m: int = 500

class ProjectResponse(ProjectCreate):
    id: str
    class Config:
        from_attributes = True
