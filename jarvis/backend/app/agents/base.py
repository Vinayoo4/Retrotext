from typing import Dict, Any, List
from app.models.schemas import AgentManifest

class BaseAgent:
    def __init__(self, manifest: AgentManifest):
        self.manifest = manifest

    def execute(self, task: str, context: Dict[str, Any]) -> str:
        raise NotImplementedError("Agents must implement the execute method.")
