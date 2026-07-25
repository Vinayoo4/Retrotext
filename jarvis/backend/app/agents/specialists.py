import re
import json
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.models.schemas import AgentManifest
from app.services.llm import llm_provider
from app.tools.registry import execute_tool

class GeneralAgent(BaseAgent):
    def execute(self, task: str, context: Dict[str, Any]) -> str:
        system = "You are JARVIS, a general-purpose AI assistant. Answer the user's task clearly and concisely."
        return llm_provider.generate(task, system)

class CodeAgent(BaseAgent):
    def execute(self, task: str, context: Dict[str, Any]) -> str:
        system = """You are JARVIS Code, an expert software engineering assistant.
You can use tools to perform actions. To use a tool, format your request EXACTLY like this on a new line:
TOOL_CALL: {"tool": "tool_name", "args": {"arg1": "value"}}

Available tools:
- read_file(path: str)
- write_file(path: str, content: str)
- scan_directory(path: str)
- run_command(command: str)

If you don't need a tool, just answer normally. You will receive the tool result in the next turn."""

        # Max 3 tool iterations to avoid infinite loops
        max_iterations = 3
        current_prompt = task
        full_transcript = ""

        for i in range(max_iterations):
            response = llm_provider.generate(current_prompt, system)
            full_transcript += f"\nAgent: {response}\n"

            # Simple regex to look for tool calls
            match = re.search(r'TOOL_CALL:\s*({.*})', response)
            if match:
                try:
                    tool_req = json.loads(match.group(1))
                    tool_name = tool_req.get("tool")
                    tool_args = tool_req.get("args", {})
                    if tool_name in self.manifest.allowed_tools:
                        result = execute_tool(tool_name, tool_args)
                        tool_result_str = f"TOOL_RESULT: {json.dumps(result)}"
                    else:
                        tool_result_str = f"TOOL_RESULT: Error - tool {tool_name} not allowed."
                except Exception as e:
                    tool_result_str = f"TOOL_RESULT: Error parsing tool call - {str(e)}"

                full_transcript += f"\nSystem: {tool_result_str}\n"
                current_prompt = f"The tool returned: {tool_result_str}. Continue your response or answer the user."
            else:
                # No tool called, we are done
                break

        return full_transcript

class ResearchAgent(BaseAgent):
    def execute(self, task: str, context: Dict[str, Any]) -> str:
        system = "You are JARVIS Research. Answer the task using the provided context if available."
        knowledge = context.get('knowledge_results', [])

        prompt = task
        if knowledge:
            context_str = "\n".join([r[1]['text'] for r in knowledge])
            prompt = f"Context:\n{context_str}\n\nTask: {task}"

        return llm_provider.generate(prompt, system)

class CybersecurityAgent(BaseAgent):
    def execute(self, task: str, context: Dict[str, Any]) -> str:
        system = "You are JARVIS Security, a defensive cybersecurity analyst. Provide system hardening and review guidance. Do not write exploits."
        return llm_provider.generate(task, system)

class BusinessAgent(BaseAgent):
    def execute(self, task: str, context: Dict[str, Any]) -> str:
        system = "You are JARVIS Business, an expert business and strategy analyst."
        return llm_provider.generate(task, system)

# Registry
AGENTS = {
    "general": GeneralAgent(AgentManifest(
        name="general", description="General purpose assistant", capabilities=["chat", "basic_logic"], allowed_tools=[]
    )),
    "code": CodeAgent(AgentManifest(
        name="code", description="Software engineering assistant", capabilities=["code_review", "programming"], allowed_tools=["read_file", "write_file", "scan_directory", "run_command"]
    )),
    "research": ResearchAgent(AgentManifest(
        name="research", description="Knowledge retrieval assistant", capabilities=["summarization", "search"], allowed_tools=["read_file"]
    )),
    "cybersecurity": CybersecurityAgent(AgentManifest(
        name="cybersecurity", description="Defensive security analyst", capabilities=["audit", "hardening_review"], allowed_tools=["read_file", "scan_directory"]
    )),
    "business": BusinessAgent(AgentManifest(
        name="business", description="Business logic assistant", capabilities=["planning"], allowed_tools=[]
    )),
}
