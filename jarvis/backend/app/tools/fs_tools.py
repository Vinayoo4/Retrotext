import os
import shutil
from typing import Dict, Any, List
from app.core.policy import verify_path_safe, check_action_allowed
from app.memory.database import log_audit

def read_file(path: str) -> Dict[str, Any]:
    try:
        safe_path = verify_path_safe(path, write_mode=False)
        with open(safe_path, 'r', encoding='utf-8') as f:
            content = f.read()
        log_audit("tool_read_file", {"path": safe_path, "size": len(content)})
        return {"status": "success", "content": content}
    except Exception as e:
        log_audit("tool_read_file", {"path": path}, status="error", error=str(e))
        return {"status": "error", "message": str(e)}

def write_file(path: str, content: str) -> Dict[str, Any]:
    try:
        check_action_allowed("write_file", {"path": path})
        safe_path = verify_path_safe(path, write_mode=True)
        with open(safe_path, 'w', encoding='utf-8') as f:
            f.write(content)
        log_audit("tool_write_file", {"path": safe_path, "size": len(content)})
        return {"status": "success", "message": f"Wrote {len(content)} bytes to {safe_path}"}
    except Exception as e:
        log_audit("tool_write_file", {"path": path}, status="error", error=str(e))
        return {"status": "error", "message": str(e)}

def scan_directory(path: str) -> Dict[str, Any]:
    try:
        safe_path = verify_path_safe(path, write_mode=False)
        files = []
        dirs = []
        for entry in os.scandir(safe_path):
            if entry.is_file():
                files.append(entry.name)
            elif entry.is_dir():
                dirs.append(entry.name)
        log_audit("tool_scan_directory", {"path": safe_path, "files": len(files), "dirs": len(dirs)})
        return {"status": "success", "files": files, "dirs": dirs}
    except Exception as e:
        log_audit("tool_scan_directory", {"path": path}, status="error", error=str(e))
        return {"status": "error", "message": str(e)}
