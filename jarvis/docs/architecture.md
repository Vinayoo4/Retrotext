# JARVIS Core Architecture

## Kernel
The central orchestration layer is `app/core/kernel.py`. It takes user inputs, classifies them, and assigns them to the appropriate **Specialist Agent**.

## Agents
The specialist agents (Code, General, Business, Cybersecurity, Research) inherit from `BaseAgent` and implement an `execute` function. They return results back to the Kernel.

## Tools Layer
Located in `app/tools/`, these Python modules perform the physical bounds of system tasks, like executing scripts, reading/writing files, and scanning directories. Every call made via tools is authenticated and checked against policy rules (`app/core/policy.py`).

## Memory
The database is built on top of SQLite, ensuring completely local functionality without needing complex network databases.

## Knowledge Ingestion
Knowledge uses `FAISS` and a lightweight local model (`nomic-embed-text` assumed via local HTTP inference) to create a private vector store. When users upload files (.txt, .md, .pdf), they are chunked, stored in the db, and indexed by FAISS.
