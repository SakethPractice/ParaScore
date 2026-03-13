# 🎮 ParaScore - Game Leaderboard System

A full-stack game leaderboard system with multiple games, player score submission, and admin management.

**Tech Stack:** React + Vite + TailwindCSS (Frontend) | Express.js + MySQL (Backend)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14+ ([Download](https://nodejs.org/))
- **MySQL** v5.7+ ([Download](https://www.mysql.com/downloads/mysql/))

### Start in 5 Minutes

**1. Create database:**
```bash
mysql -u root -e "CREATE DATABASE parascore_db;"
```

**2. Start backend** (Terminal 1):
```bash
cd backend
npm install
npm run dev
```

**3. Start frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

**4. Open browser:** http://localhost:3000

---

## 📂 Project Structure

```
ParaScore/
├── 📋 QUICK_START.md              # 5-minute setup guide
├── 📋 COMPLETE_SETUP.md           # Full setup instructions
├── 📋 BACKEND_SETUP.md            # Detailed backend guide
├── 📋 API_DOCUMENTATION.md        # Complete API reference
├── 📋 API_TESTS.md                # Test examples
│
├── frontend/                      # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Landing page
│   │   │   ├── LeaderboardPage.jsx # View leaderboards
│   │   │   ├── SubmitScore.jsx    # Submit scores
│   │   │   ├── AdminLogin.jsx     # Admin authentication
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── Leaderboard.jsx
│   │   │   ├── GameSwitcher.jsx
│   │   │   ├── ScoreRow.jsx
│   │   │   ├── ConfettiEffect.jsx
│   │   │   ├── MedalDisplay.jsx
│   │   │   └── RankChange.jsx
│   │   └── services/
│   │       └── api.js            # Axios API client
│   ├── package.json
│   └── vite.config.js
│
├── backend/                       # Express.js + MySQL
│   ├── controllers/
│   │   ├── scoreController.js     # Score logic
│   │   └── adminController.js     # Admin operations
│   ├── routes/
│   │   ├── scoreRoutes.js         # Public endpoints
│   │   └── adminRoutes.js         # Admin endpoints
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT authentication
│   ├── database/
│   │   └── db.js                  # MySQL connection
│   ├── server.js                  # Express setup
│   ├── package.json
│   ├── .env                       # Configuration (local)
│   └── .env.example               # Configuration template
│
├── database/
│   └── schema.sql                 # Database schema
│
└── README.md
```

---

## ✨ Features

### 🎮 Multiple Game Support
- **NFS** - Need for Speed (time-based scoring)
- **ALTOS** - Altos Adventure (score-based)
- **ULTRAKILL** - ULTRAKILL (rank-based)

### 👥 Player Features
- ✅ Submit scores for different games
- ✅ View live leaderboards
- ✅ Real-time score updates
- ✅ Player rankings with medals

### 👨‍💼 Admin Features
- ✅ JWT-based authentication
- ✅ Create/delete games
- ✅ Delete individual scores
- ✅ Reset game leaderboards
- ✅ View all scores

### 🛡️ Security
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS enabled
- ✅ JWT token authentication
- ✅ Password hashing (bcrypt)

---

## 📊 API Endpoints

### Public (No Auth Required)

```http
POST   /api/scores/submit           # Submit a score
GET    /api/scores/leaderboard      # Get all scores
GET    /api/scores/leaderboard/:id  # Get game leaderboard
GET    /api/scores/games            # List all games
GET    /api/health                  # Health check
```

### Admin (JWT Required)

```http
POST   /api/admin/login             # Authenticate (no token needed)
POST   /api/admin/games             # Create game
DELETE /api/admin/games/:id         # Delete game
DELETE /api/admin/scores/:id        # Delete score
DELETE /api/admin/leaderboard/:id   # Reset leaderboard
GET    /api/admin/scores            # View all scores
```

---

## 🔧 Configuration

Backend configuration in `backend/.env`:

```env
PORT=5000                              # Server port
NODE_ENV=development                   # Environment

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=parascore_db

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=deltatime2024

# JWT
JWT_SECRET=your-secret-key-change-in-production
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup guide |
| **COMPLETE_SETUP.md** | Full setup & troubleshooting |
| **BACKEND_SETUP.md** | Detailed backend documentation |
| **API_DOCUMENTATION.md** | Complete API reference |
| **API_TESTS.md** | curl, JavaScript & Axios examples |

---

## 🎯 Core Workflow

```
1. User visits http://localhost:3000
2. User can:
   - View leaderboards for different games
   - Submit scores for their game
3. Scores update in real-time
4. Admin can:
   - Log in with admin/deltatime2024
   - Manage games and scores
```

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"Server is running"}
```

### Test Score Submission
```bash
curl -X POST http://localhost:5000/api/scores/submit \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "John Doe",
    "srn": "MA20B001",
    "game": "ALTOS",
    "score": "45000"
  }'
```

See **API_TESTS.md** for more examples.

---

## 🐛 Troubleshooting

### Common Issues

**MySQL Connection Error**
- Ensure MySQL is running: `mysql -u root`
- Check `.env` credentials match

**Port 5000 Already in Use**
- Change `PORT` in `.env`
- Or: `lsof -i :5000` then `kill -9 <PID>`

**Frontend Can't Reach Backend**
- Verify backend is running: `http://localhost:5000/api/health`
- Check `FRONTEND_URL` in `.env`

**Scores Not Submitting**
- Use valid game ID: NFS, ALTOS, ULTRAKILL
- Ensure all fields are filled
- Check backend console for errors

See **COMPLETE_SETUP.md** for detailed troubleshooting.

---

## 🚀 Production Deployment

Before deploying:

1. **Change admin password** in `.env`
2. **Generate new JWT secret** (32-char random string)
3. **Set proper DB credentials**
4. **Set NODE_ENV=production**
5. **Use environment-specific database**
6. **Enable HTTPS**
7. **Set up monitoring & logging**

---

## 📋 Database Schema

### games
```sql
id          VARCHAR(50)   PRIMARY KEY
name        VARCHAR(100)  NOT NULL
description VARCHAR(500)
created_at  TIMESTAMP
```

### scores
```sql
id          INT           AUTO_INCREMENT PRIMARY KEY
player_name VARCHAR(100)  NOT NULL
srn         VARCHAR(50)
score       VARCHAR(100)  NOT NULL
game_id     VARCHAR(50)   FOREIGN KEY
created_at  TIMESTAMP
```

---

## 🎓 What's Included

✅ **Backend** - Fully implemented Express.js server  
✅ **Database** - MySQL schema with automation  
✅ **Frontend** - Complete React application (React + Vite + TailwindCSS)  
✅ **Authentication** - JWT-based admin authentication  
✅ **Documentation** - Complete setup & API guides  
✅ **Testing** - Example requests & curl commands  

---

## 📞 Support

For help:
1. Check logs in terminal
2. Review **COMPLETE_SETUP.md**
3. See **API_DOCUMENTATION.md** for endpoints
4. Test directly with curl commands from **API_TESTS.md**

---

## 📄 License

ISC

---

## 👨‍💻 Tech Stack

**Frontend:**
- React 18
- Vite
- TailwindCSS
- Framer Motion
- Axios
- Lucide Icons
- Canvas Confetti

**Backend:**
- Node.js
- Express.js 5
- MySQL2
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

**Database:**
- MySQL 5.7+

---

**Version:** 1.0.0  
**Last Updated:** March 2024
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