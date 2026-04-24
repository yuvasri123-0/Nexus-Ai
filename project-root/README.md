# ProjectForge AI (Idea2App)

An autonomous platform that generates and architects full-stack software projects based on selected domains.

## Features
- **Domain Explorer**: Select tech domains (SaaS, AI, Web3, etc.).
- **Idea Engine**: Generates unique app ideas dynamically.
- **Autonomous Builder**: Simulates AI code generation spanning architecture, schemas, and endpoints.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## Installation

### Prerequisites
- Node.js (v18+)
- MongoDB connection string

### Setup
1. Clone the repository
2. Install Server Dependencies:
   `cd server && npm install`
3. Setup Server Environment Variables:
   Create `server/.env` and add `MONGO_URI` and `PORT=5000`.
4. Install Client Dependencies:
   `cd client && npm install`

### Local Development
- Start Server: `cd server && npm run dev`
- Start Client: `cd client && npm run dev`
