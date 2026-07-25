# SALTEDHASH JARVIS

Welcome to the foundational core of the SALTEDHASH JARVIS AI platform. This is a local-first, modular, private AI intelligence kernel designed for secure personal operation and extensible architectural growth.

## Core Features
- **Local API Kernel:** Orchestrates tasks, routes agents, and enforces security policies.
- **Agent Registry:** Modular specialist agents (Code, Research, Cybersecurity, Business, General).
- **Knowledge Ingestion:** Ingests TXT, MD, Code, and PDF files, chunks them, and stores embeddings using a local vector store (FAISS).
- **Defensive Cybersecurity Tooling:** Local policy enforcement and secure command execution blocks.
- **Web Dashboard:** Minimal, robust Vue 3 dashboard to monitor system status, view task logs, search knowledge, and manage data.

## Project Architecture
```
jarvis/
├── backend/
│   ├── app/
│   │   ├── api/        # FastAPI routes
│   │   ├── core/       # Kernel orchestrator & policy engine
│   │   ├── agents/     # Agent registry & specialists
│   │   ├── tools/      # FS and OS interaction tools
│   │   ├── knowledge/  # Ingestion & retrieval
│   │   ├── memory/     # SQLite database
│   │   └── models/     # Pydantic schemas
│   └── data/           # Local databases and vector stores
├── frontend/
│   ├── src/
│   │   ├── views/      # Vue UI components
│   │   └── router/
│   └── package.json
└── README.md
```

## Running the Backend

Ensure you have Python 3.12+ installed.

1. Navigate to the backend directory:
   \`cd jarvis/backend\`
2. Install dependencies:
   \`pip install -r requirements.txt\`
3. Initialize and run the server:
   \`PYTHONPATH=. python -c "from app.memory.database import init_db; init_db()"\`
   \`uvicorn app.main:app --host 0.0.0.0 --port 8000\`

*Note: You can configure model endpoints using a \`.env\` file referencing variables in \`app/config/settings.py\`.*

## Running the Frontend

Ensure you have Node.js and NPM installed.

1. Navigate to the frontend directory:
   \`cd jarvis/frontend\`
2. Install packages:
   \`npm install\`
3. Start the Vite dev server:
   \`npm run dev\`

The frontend will run by default on \`http://localhost:3000\`.
