import sqlite3
import json
import uuid
import time
from typing import Dict, Any, List, Optional
from app.config.settings import settings

def get_connection():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Tasks table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        task_input TEXT NOT NULL,
        agent_used TEXT NOT NULL,
        status TEXT NOT NULL,
        result_summary TEXT,
        duration REAL,
        created_at REAL,
        completed_at REAL
    )
    ''')

    # Audit Logs table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        action TEXT NOT NULL,
        details TEXT,
        timestamp REAL,
        status TEXT,
        error TEXT,
        requires_confirmation BOOLEAN DEFAULT 0
    )
    ''')

    # Knowledge Metadata table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS knowledge_metadata (
        id TEXT PRIMARY KEY,
        file_path TEXT NOT NULL,
        file_type TEXT NOT NULL,
        checksum TEXT NOT NULL,
        chunk_count INTEGER,
        ingest_time REAL,
        status TEXT
    )
    ''')

    # Memory entries (session, project, etc)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS memory_entries (
        id TEXT PRIMARY KEY,
        memory_type TEXT NOT NULL,
        key TEXT,
        content TEXT NOT NULL,
        timestamp REAL
    )
    ''')

    conn.commit()
    conn.close()

# Memory functions
def add_memory(memory_type: str, content: str, key: str = None) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    mem_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO memory_entries (id, memory_type, key, content, timestamp) VALUES (?, ?, ?, ?, ?)",
        (mem_id, memory_type, key, content, time.time())
    )
    conn.commit()
    conn.close()
    return mem_id

def get_memories(memory_type: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    if memory_type:
        cursor.execute("SELECT * FROM memory_entries WHERE memory_type = ? ORDER BY timestamp DESC LIMIT ?", (memory_type, limit))
    else:
        cursor.execute("SELECT * FROM memory_entries ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

# Audit Log Functions
def log_audit(action: str, details: Dict[str, Any], task_id: Optional[str] = None, status: str = "success", error: Optional[str] = None, requires_confirmation: bool = False):
    conn = get_connection()
    cursor = conn.cursor()
    log_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO audit_logs (id, task_id, action, details, timestamp, status, error, requires_confirmation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        (log_id, task_id, action, json.dumps(details), time.time(), status, error, requires_confirmation)
    )
    conn.commit()
    conn.close()
    return log_id

def get_audit_logs(limit: int = 100) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    result = []
    for row in rows:
        d = dict(row)
        try:
            d['details'] = json.loads(d['details'])
        except:
            pass
        result.append(d)
    return result

# Task functions
def create_task(task_input: str, agent_used: str) -> str:
    conn = get_connection()
    cursor = conn.cursor()
    task_id = str(uuid.uuid4())
    cursor.execute(
        "INSERT INTO tasks (id, task_input, agent_used, status, created_at) VALUES (?, ?, ?, ?, ?)",
        (task_id, task_input, agent_used, "running", time.time())
    )
    conn.commit()
    conn.close()
    return task_id

def complete_task(task_id: str, status: str, result_summary: str, duration: float):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE tasks SET status = ?, result_summary = ?, duration = ?, completed_at = ? WHERE id = ?",
        (status, result_summary, duration, time.time(), task_id)
    )
    conn.commit()
    conn.close()

def get_tasks(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
