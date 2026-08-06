# J.A.R.V.I.S v3 Architectural Next Steps

## Status
- **Phase 0 (Foundation)**: Complete. Vue 3/Express/JSON-first baseline established. OS Modules (Catalogue, Expenses, Parties, Insights, Settings, Desk) are active and locally persistent with offline support.
- **Phase 1 (Knowledge Engine)**: Scaffolded. Controllers and schemas for ingestion, storage, and retrieval exist. Vector DB and chunking implementations pending LLM wiring.
- **Phase 2 (Agent Runtime / Missions)**: Scaffolded. Workstreams and command dispatch architecture is built and visible via the Missions UI. Parallel loop execution engine pending.

## Imminent Phase Builds (To Execute in Future Commands)

### Phase 3 - Day Sheet Engine
- **Goal**: Auto-organize notes, tasks, expenses into a daily rollup.
- **Next steps**:
    1. Create `backend/src/controllers/daySheetController.ts`.
    2. Hook into `expensesController` and `knowledgeController` creates to auto-file items into the current day's sheet.
    3. Implement gap detection and summary generation logic via LLM call.

### Phase 4 - Builder Pack
- **Goal**: Full stack PWA generation from a single command.
- **Next steps**:
    1. Create `backend/src/agent/builder.ts` implementing a `Workstream` executor.
    2. Add scaffold templates (Vue, Express) to `backend/templates/`.
    3. Implement `child_process.exec` wrappers to run `npm install`, `lint`, and `build` on generated output safely.

### Phase 5 - Content Factory
- **Goal**: 365-day posting plans.
- **Next steps**:
    1. Create Campaign models and endpoints.
    2. Build out the Tier 3 Approval Queue UI.
    3. Scaffold `ISocialConnector` interfaces.

### Phase 6 - Role Packs
- **Goal**: Context-aware personas.
- **Next steps**: Implement prompt decorators in the core LLM execution loop based on selected roles and inject context from the Knowledge Base.
