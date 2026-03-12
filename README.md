# ParaScore - Game Leaderboard System

A full-stack game leaderboard system built with React, Express.js, and MySQL.

## 📂 Project Structure

```
ParaScore/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── ScoreEntry.jsx
│   │   │   ├── Scoreboard.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── ScoreRow.jsx
│   │   │   ├── MedalDisplay.jsx
│   │   │   └── ConfettiEffect.jsx
│   │   ├── services/
│   │   │   └── api.js       # API calls
│   │   ├── App.jsx
│   │   ├── main.jsx         # Entry point
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express.js backend
│   ├── routes/
│   │   ├── authRoutes.js    # User authentication
│   │   ├── scoreRoutes.js   # Score management
│   │   └── adminRoutes.js   # Admin operations
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── scoreController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── database/
│   │   ├── db.js            # MySQL connection
│   │   └── (schema in /database/schema.sql)
│   ├── server.js            # Express app setup
│   ├── package.json
│   └── .env.example
│
├── database/
│   └── schema.sql           # Database schema
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)
- npm or yarn

### Installation

1. **Navigate to project**
```bash
cd ParaScore
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**
Edit `backend/.env` with your database credentials

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📋 Features

### User Features
- Player registration and login
- Score submission
- Real-time leaderboard
- Top 10 scores display
- Confetti celebration on score submission

### Admin Features
- Admin login
- View all users
- Delete scores
- View game statistics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

### Scores
- `GET /api/scores` - Get all scores
- `GET /api/scores/top` - Get top scores
- `POST /api/scores` - Submit score (requires auth)
- `GET /api/scores/user/:userId` - Get user scores

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/scores/:scoreId` - Delete score
- `GET /api/admin/stats` - Get statistics

## 📄 License

ISC