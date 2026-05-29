# Arctic Focus

Arctic Focus is a full-stack productivity web app built with React, Vite, Express, and MongoDB. It includes user authentication, focus session tracking, goal management, history, and settings.

## Features

- User login and protected routes
- Focus timer and session tracking
- Goal management
- Session history and progress views
- Settings page for app preferences
- Production-ready Express server that serves the built client

## Tech stack

- **Frontend:** React, React Router, Vite
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **Auth:** JWT-based authentication

## Project structure

- `client/` — React frontend
- `server/` — Express backend and MongoDB integration

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB running locally or a MongoDB connection string

## Installation

From the project root:

```bash
npm install
```

This installs dependencies for both workspaces.

## Environment variables

Create a `.env` file in `server/` if you want to override defaults.

Example:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/arcticfocus
```

If `MONGODB_URI` is not set, the app uses `mongodb://localhost:27017/arcticfocus`.

## Running locally

Start the backend:

```bash
npm run dev:server
```

Start the frontend:

```bash
npm run dev:client
```

The client runs on Vite's default port, and the server runs on the configured backend port.

## Build for production

Build the client:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

In production, the Express server serves the built frontend from `client/dist`.

## API overview

The backend exposes API routes under `/api` for:

- authentication
- sessions
- stats
- goals
- settings

## Notes

- The app assumes MongoDB is available locally unless a custom `MONGODB_URI` is provided.
- For deployment, host the frontend build and run the Express server in production mode.
