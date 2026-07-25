from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.models.schemas import TaskRequest, TaskResponse, AgentManifest, KnowledgeIngestRequest, SearchRequest
from app.core.kernel import kernel
from app.agents.specialists import AGENTS
from app.knowledge.ingest import ingest_file
from app.knowledge.store import store
from app.memory.database import get_tasks, get_audit_logs, get_memories

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}

@router.get("/agents", response_model=List[AgentManifest])
def list_agents():
    return [agent.manifest for agent in AGENTS.values()]

@router.post("/tasks/run", response_model=TaskResponse)
def run_task(request: TaskRequest):
    task_id, status, result, agent_used = kernel.execute_task(request.task, request.agent_override)
    return TaskResponse(
        task_id=task_id,
        status=status,
        result=result,
        agent_used=agent_used
    )

@router.get("/tasks", response_model=List[Dict[str, Any]])
def list_tasks(limit: int = 50):
    return get_tasks(limit)

@router.post("/knowledge/ingest")
def ingest_knowledge(request: KnowledgeIngestRequest):
    result = ingest_file(request.file_path)
    if result["status"] == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

@router.post("/knowledge/search")
def search_knowledge(request: SearchRequest):
    results = store.search(request.query, k=request.limit)
    formatted = [{"distance": d, "metadata": m} for d, m in results]
    return {"results": formatted}

@router.get("/memory")
def get_memory_entries(memory_type: str = None, limit: int = 50):
    return get_memories(memory_type, limit)

@router.get("/audit")
def get_audit(limit: int = 100):
    return get_audit_logs(limit)
