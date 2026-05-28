# Code Canvas

A minimal, aesthetic, collaborative web code editor built for the SALTEDHASH umbrella.

## Features
- Minimalistic, aesthetic Code Editor UI
- Theme support (Dark Canvas, Light Canvas)
- PWA with offline support
- Local drafting persistence (LocalStorage)
- Session export and import logic (simulated collaboration MVP)
- Secured Express backend APIs (hashed passwords, JSON local data storage)

## Production Deployment

This project uses local-first JSON storage, a lightweight Express backend, and a Vite Vue 3 frontend.

### 1. Backend Server Setup
1. Open terminal and go to the \`backend\` directory: \`cd backend\`
2. Install dependencies: \`npm install\`
3. Start the server in production mode: \`npm run build && npm start\` (Make sure \`NODE_ENV=production\`)
4. Data is stored locally under \`data/\`

### 2. Frontend Build
1. Open terminal and go to the \`frontend\` directory: \`cd frontend\`
2. Ensure you have the right production environment variables set up (\`VITE_API_URL=/api\` in \`.env.production\`).
3. Build the assets: \`npm run build\`
4. The output in \`frontend/dist\` is fully static and production-ready. You can serve it via Nginx or merge it into the Express static paths.

## Testing & Verification
The setup uses zero unnecessary boilerplate. Core functionality includes registering users, logging in, creating snippet sessions, and toggling themes via local JSON caches.
