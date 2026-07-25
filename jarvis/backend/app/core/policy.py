import os
from app.config.settings import settings
from app.memory.database import log_audit

class PolicyViolation(Exception):
    pass

def verify_path_safe(requested_path: str, write_mode: bool = False) -> str:
    """Check if the requested path is within allowed directories."""
    abs_path = os.path.abspath(requested_path)
    allowed = False

    for allowed_dir in settings.ALLOWED_TOOL_PATHS:
        if abs_path.startswith(allowed_dir):
            allowed = True
            break

    if not allowed:
        log_audit(
            action="policy_violation",
            details={"path": requested_path, "write_mode": write_mode, "reason": "Path not in allowed directories"},
            status="blocked"
        )
        raise PolicyViolation(f"Path '{requested_path}' is outside allowed directories.")

    return abs_path

def check_action_allowed(action_name: str, args: dict) -> bool:
    """Enforces strict policy checks for risky actions."""
    if action_name in ["write_file", "delete_file"]:
        if settings.REQUIRE_CONFIRMATION_FOR_DESTRUCTIVE:
            log_audit(
                action="policy_check",
                details={"action": action_name, "args": args},
                status="pending",
                requires_confirmation=True
            )
            # We allow it in v1 but it must be within allowed paths which is checked downstream
            return True

    if action_name == "run_command":
        # Strictly deny dangerous shell commands.
        command = args.get("command", "")
        dangerous_tokens = ["rm ", "mv ", "wget ", "curl ", ">", ">>", "|", ";", "&"]

        # Enforce deny by default for shell execution unless explicitly safe (e.g. ls, echo)
        # For a truly defensive system, we whitelist commands.
        allowed_commands = ["ls", "pwd", "echo", "date", "whoami", "cat"]
        is_safe = False
        cmd_base = command.split()[0] if command else ""

        if cmd_base in allowed_commands and not any(token in command for token in dangerous_tokens):
            is_safe = True

        if not is_safe:
            log_audit(
                action="policy_violation",
                details={"action": action_name, "command": command, "reason": "Dangerous shell command blocked"},
                status="blocked"
            )
            raise PolicyViolation(f"Command execution blocked by policy: {command}")
        return True

    return True
