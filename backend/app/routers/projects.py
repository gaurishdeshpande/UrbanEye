from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.project import ProjectCreate, ProjectResponse
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

# In-memory storage for now (replace with DB later)
mock_db = {}

@router.post("/", response_model=ProjectResponse)
def create_project(project: ProjectCreate):
    project_id = str(uuid.uuid4())
    new_project = project.dict()
    new_project["id"] = project_id
    mock_db[project_id] = new_project
    return new_project

@router.get("/", response_model=List[ProjectResponse])
def get_projects():
    return list(mock_db.values())

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    if project_id not in mock_db:
        raise HTTPException(status_code=404, detail="Project not found")
    return mock_db[project_id]
