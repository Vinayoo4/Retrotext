import subprocess
from typing import Dict, Any
from app.core.policy import check_action_allowed
from app.memory.database import log_audit

def run_command(command: str) -> Dict[str, Any]:
    try:
        check_action_allowed("run_command", {"command": command})

        # In a real system, you'd want heavier sandboxing.
        # For v1, we run it and capture output.
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=30 # 30s timeout
        )

        details = {
            "command": command,
            "returncode": result.returncode,
            "stdout": result.stdout[:1000], # Truncate for logging
            "stderr": result.stderr[:1000]
        }

        log_audit("tool_run_command", details, status="success" if result.returncode == 0 else "error")
        return {
            "status": "success" if result.returncode == 0 else "error",
            "returncode": result.returncode,
            "stdout": result.stdout,
            "stderr": result.stderr
        }
    except Exception as e:
        log_audit("tool_run_command", {"command": command}, status="error", error=str(e))
        return {"status": "error", "message": str(e)}
