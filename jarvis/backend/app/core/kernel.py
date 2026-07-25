import time
from typing import Dict, Any, Tuple
from app.agents.specialists import AGENTS
from app.memory.database import create_task, complete_task
from app.knowledge.store import store

class Kernel:
    def __init__(self):
        self.agents = AGENTS

    def _route_task(self, task: str, override: str = None) -> str:
        """Simple rule-based router for v1."""
        if override and override in self.agents:
            return override

        task_lower = task.lower()
        if any(word in task_lower for word in ["code", "bug", "script", "refactor"]):
            return "code"
        elif any(word in task_lower for word in ["research", "search", "find", "knowledge", "document"]):
            return "research"
        elif any(word in task_lower for word in ["security", "vulnerability", "audit", "hardening", "secret"]):
            return "cybersecurity"
        elif any(word in task_lower for word in ["business", "strategy", "market"]):
            return "business"

        return "general"

    def execute_task(self, task_input: str, agent_override: str = None) -> Tuple[str, str, str]:
        start_time = time.time()

        # 1. Routing
        agent_name = self._route_task(task_input, agent_override)
        agent = self.agents[agent_name]

        # 2. Record Task Start
        task_id = create_task(task_input, agent_name)

        # 3. Context Preparation
        context = {}
        if agent_name == "research":
            # Auto-inject knowledge if it's a research task
            context['knowledge_results'] = store.search(task_input, k=3)

        # 4. Agent Execution (In a full system this is where LLM logic runs)
        try:
            result = agent.execute(task_input, context)
            status = "completed"
        except Exception as e:
            result = f"Task failed with error: {str(e)}"
            status = "failed"

        # 5. Record Task Completion
        duration = time.time() - start_time
        complete_task(task_id, status, result, duration)

        return task_id, status, result, agent_name

kernel = Kernel()
