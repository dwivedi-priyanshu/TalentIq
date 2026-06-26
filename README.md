# ✨ Talent IQ — Full-Stack Real-Time Collaborative Interview Platform ✨

Talent IQ is a high-performance, real-time collaborative coding interview and pair programming platform. Designed for engineers and technical recruiters, it combines live HD video/audio conferencing, instant messaging, an interactive multi-language code editor, and secure sandboxed code execution in a single seamless workspace.

![Talent IQ Demo Screenshot](./frontend/public/screenshot-for-readme.png)

---

## 🚀 Key Features

*   **🔐 Seamless Authentication & Auto-Sync**: Integrated with Clerk for secure, multi-tenant authentication. Leverages **Inngest** background jobs and webhooks to synchronize Clerk user accounts with MongoDB and GetStream user profiles asynchronously.
*   **🎥 1-on-1 Interactive Video Rooms**: Built on the **GetStream Video SDK** to support high-definition video/audio calls. Includes camera/microphone toggling, real-time participant counts, and screen-sharing controls.
*   **💬 Real-Time Session Chat**: Embedded chat sidebar powered by **GetStream Chat SDK** for instant messaging, sharing hints, and communication within the interview room.
*   **🧑‍💻 VSCode-Powered Monaco Editor**: A full-featured, collaborative code editor using `@monaco-editor/react`. Supports multiple programming languages (JavaScript, Python, Java) with syntax highlighting, customizable themes, and automatic layout adjustments.
*   **⚙️ Sandboxed Code Execution**: Run and test solutions securely in an isolated runtime environment via the **Judge0 CE API**. Automatically handles language mappings and runtime errors.
*   **🎯 Automated Test-Case Evaluation**: Normalizes standard outputs (handling varying bracket spacing, trailing whitespaces, and comma formats) to verify solutions. Triggers visual celebrations (**Canvas Confetti**) on success and error toasts on failure.
*   **🔒 Session Access Control & Room Locking**: Enforces a strict 1-on-1 structure by allowing only 2 active participants per room (the host and one participant), managed via Mongoose session models.
*   **🧭 Rich Interactive Dashboard**: Features live session tracking, real-time statistics (total, easy, medium, and hard problems), and a simple wizard to spawn new collaborative rooms.
*   **🧩 Solo Practice Mode**: Includes a curated practice problem directory where users can solve algorithmic challenges individually.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React 19, Vite, React Router v7
*   **Styling**: Tailwind CSS v4, DaisyUI v5 (components and themes)
*   **State Management & Data Fetching**: TanStack Query (React Query) v5, Axios
*   **Editor & Terminal**: Monaco Editor (`@monaco-editor/react`), Custom Output Console
*   **Video & Chat**: GetStream Video & Chat React SDKs
*   **Animations & Feedback**: Canvas Confetti, React Hot Toast, Lucide Icons

### Backend
*   **Core**: Node.js (ES Modules), Express
*   **Database**: MongoDB, Mongoose ODM
*   **Background Jobs**: Inngest (Serverless background execution framework)
*   **Authentication**: Clerk Express SDK (`@clerk/express`)
*   **Video & Chat Orchestration**: GetStream Node Server SDK (`@stream-io/node-sdk` and `stream-chat`)

---

## 📂 Project Structure

```text
talent-iq/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API Request handlers (sessions, chat tokens)
│   │   │   ├── chatController.js
│   │   │   └── sessionController.js
│   │   ├── lib/              # Database, Inngest, Stream SDK initializations
│   │   │   ├── db.js
│   │   │   ├── env.js
│   │   │   ├── inngest.js
│   │   │   └── stream.js
│   │   ├── middleware/       # Route protection & Clerk authentication guards
│   │   │   └── protectRoute.js
│   │   ├── models/           # Mongoose schemas (User, Session)
│   │   │   ├── Session.js
│   │   │   └── User.js
│   │   ├── routes/           # REST API routes
│   │   │   ├── chatRoutes.js
│   │   │   └── sessionRoute.js
│   │   └── server.js         # Entry point & production build static server
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/              # Axios API calls
│   │   │   └── sessions.js
│   │   ├── components/       # Shared UI components (Navbar, Stats, Modals)
│   │   │   ├── ActiveSessions.jsx
│   │   │   ├── CodeEditorPanel.jsx
│   │   │   ├── CreateSessionModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OutputPanel.jsx
│   │   │   ├── ProblemDescription.jsx
│   │   │   ├── RecentSessions.jsx
│   │   │   ├── StatsCards.jsx
│   │   │   ├── VideoCallUI.jsx
│   │   │   └── WelcomeSection.jsx
│   │   ├── data/             # Local problem bank and language configs
│   │   │   └── problems.js
│   │   ├── hooks/            # Custom React Query & Stream hooks
│   │   │   ├── useSessions.js
│   │   │   └── useStreamClient.js
│   │   ├── lib/              # Client initializations (Axios, GetStream, Judge0 execution)
│   │   │   ├── axios.js
│   │   │   ├── piston.js     # Judge0 code execution engine
│   │   │   ├── stream.js
│   │   │   └── utils.js
│   │   ├── pages/            # Core views (Home, Dashboard, Room, Solo Practice)
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProblemPage.jsx
│   │   │   ├── ProblemsPage.jsx
│   │   │   └── SessionPage.jsx
│   │   ├── App.jsx           # Routing mapping
│   │   ├── main.jsx          # React app entry point & Providers (Clerk, QueryClient, Router)
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
```

---

## 🗄️ Database Schemas

### User Schema (`User.js`)
Stores authenticated user records synchronized via Clerk Webhooks.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "" },
  clerkId: { type: String, required: true, unique: true }
}
```

### Session Schema (`Session.js`)
Tracks the active state, configuration, and participants of collaborative rooms.
```javascript
{
  problem: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  callId: { type: String, default: "" } // Maps to the GetStream Call ID
}
```

---

## 🔌 API Endpoints

All endpoints (except server health and Inngest webhooks) are protected and require a valid Clerk Authentication Token.

### 💬 Chat Services
*   `GET /api/chat/token`: Generates a secure authentication token for GetStream Chat & Video SDKs.

### 🎮 Session Services
*   `POST /api/sessions`: Creates a new coding session, registers a new GetStream Video Call and Chat Channel, and returns the session details.
*   `GET /api/sessions/active`: Retrieves the 20 most recent active rooms.
*   `GET /api/sessions/my-recent`: Retrieves completed rooms where the user was either the host or participant.
*   `GET /api/sessions/:id`: Retrieves full details of a specific session by ID.
*   `POST /api/sessions/:id/join`: Registers the current user as the session's participant and adds them to the room's stream video and chat channel.
*   `POST /api/sessions/:id/end`: Destroys the GetStream call & channel, and marks the session as `completed` (restricted to the room's host).

---

## 🧪 Configuration & Environment Setup

### Backend Configuration (`/backend/.env`)

Create a `.env` file inside the `backend` directory:

```bash
PORT=3000
NODE_ENV=development

# MongoDB Connection String
DB_URL=your_mongodb_connection_url

# Inngest Keys (Background jobs coordination)
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# GetStream Credentials (From Stream Dashboard)
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Clerk Authentication (From Clerk Dashboard)
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Frontend Client Address
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`/frontend/.env`)

Create a `.env` file inside the `frontend` directory:

```bash
# Clerk Authentication Key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Backend API Root Url
VITE_API_URL=http://localhost:3000/api

# GetStream API Key
VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🔧 Installation & Running Locally

### Prerequisites
*   Node.js (v18 or higher)
*   MongoDB Instance (Local or Atlas)
*   Inngest Dev Server (for local webhook execution testing)

### Step 1: Install Dependencies
Run npm installation in both backend and frontend directories:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Running Development Servers
You will need to run the backend server, the frontend server, and optionally the Inngest Dev Server to test Webhooks.

#### Run Backend:
```bash
cd backend
npm run dev
```

#### Run Frontend:
```bash
cd frontend
npm run dev
```

#### Run Inngest Dev Server (Local webhook testing):
```bash
# Start Inngest development environment locally
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

---

## 🚀 Deployment

The project is structured to easily run production builds. In production mode, the Express server serves the static frontend assets from `/frontend/dist`.

1.  Build the frontend:
    ```bash
    cd frontend
    npm run build
    ```
2.  Start the backend server in production:
    ```bash
    cd ../backend
    NODE_ENV=production npm start
    ```
