from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TaskRequest(BaseModel):
    task: str = Field(..., description="The task description or query.")
    agent_override: Optional[str] = Field(None, description="Force a specific agent to handle the task.")

class TaskResponse(BaseModel):
    task_id: str
    status: str
    result: str
    agent_used: str

class AgentManifest(BaseModel):
    name: str
    description: str
    capabilities: List[str]
    allowed_tools: List[str]

class KnowledgeIngestRequest(BaseModel):
    file_path: str

class SearchRequest(BaseModel):
    query: str
    limit: int = 5
