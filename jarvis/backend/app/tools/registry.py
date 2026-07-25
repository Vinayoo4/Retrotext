from typing import Dict, Callable, Any
from app.tools.fs_tools import read_file, write_file, scan_directory
from app.tools.cmd_tools import run_command

TOOL_REGISTRY: Dict[str, Callable] = {
    "read_file": read_file,
    "write_file": write_file,
    "scan_directory": scan_directory,
    "run_command": run_command
}

def execute_tool(tool_name: str, kwargs: Dict[str, Any]) -> Dict[str, Any]:
    if tool_name not in TOOL_REGISTRY:
        return {"status": "error", "message": f"Tool '{tool_name}' not found."}

    func = TOOL_REGISTRY[tool_name]
    try:
        return func(**kwargs)
    except Exception as e:
        return {"status": "error", "message": f"Exception in tool '{tool_name}': {str(e)}"}
