# 📊 ParaScore - Complete Setup Instructions

This document provides everything you need to get the ParaScore leaderboard system running from scratch.

---

## 🎯 Overview

ParaScore is a full-stack leaderboard system with:
- **Frontend**: React + Vite + TailwindCSS (already implemented)
- **Backend**: Express.js + MySQL (we just built this)
- **Features**: Multiple game leaderboards, score submission, admin management

---

## 🗂️ Project Structure

```
ParaScore/
├── backend/                    (The API server - newly built)
│   ├── controllers/
│   │   ├── scoreController.js  (Score submission/retrieval logic)
│   │   └── adminController.js  (Admin management logic)
│   ├── routes/
│   │   ├── scoreRoutes.js      (Public score endpoints)
│   │   └── adminRoutes.js      (Admin endpoints)
│   ├── middleware/
│   │   └── authMiddleware.js   (JWT authentication)
│   ├── database/
│   │   └── db.js               (MySQL connection)
│   ├── server.js               (Express server setup)
│   ├── package.json            (Dependencies)
│   ├── .env.example            (Configuration template)
│   └── .env                    (Your configuration)
│
├── frontend/                   (The React app - already complete)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js          (Axios base URL: http://localhost:5000/api)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── schema.sql              (Database setup script)
│
├── QUICK_START.md              (Fast setup guide)
├── BACKEND_SETUP.md            (Full backend documentation)
├── API_DOCUMENTATION.md        (Complete API reference)
├── API_TESTS.md                (Test examples)
└── README.md                   (Project overview)
```

---

## 📋 Prerequisites

### Check System Requirements

**Node.js & npm:**
```bash
node --version  # Should be v14 or higher
npm --version
```

**MySQL Server:**
```bash
mysql --version  # Should be v5.7 or higher
```

**Not installed?**
- Node.js: https://nodejs.org/
- MySQL: https://www.mysql.com/downloads/mysql/

---

## ⚡ Quick Start (5 Minutes)

### 1️⃣ Start MySQL

**Windows:**
```bash
net start MySQL80
```

**macOS:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Verify it's running:**
```bash
mysql -u root
> EXIT;
```

---

### 2️⃣ Create Database

```bash
mysql -u root -e "CREATE DATABASE parascore_db;"
```

---

### 3️⃣ Install & Start Backend

```bash
cd backend
npm install        # Install dependencies (takes 1-2 min)
npm run dev        # Start server with auto-reload
```

✅ **You should see:**
```
✅ Connected to MySQL database
✅ Database tables initialized
✅ Server running on http://localhost:5000
📊 API available at http://localhost:5000/api
```

---

### 4️⃣ Install & Start Frontend

In a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```

✅ **Visit:** http://localhost:3000

---

## 🧪 Test the Application

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"Server is running"}
```

### Test Frontend
Visit http://localhost:3000 and try:
1. Click "View Leaderboard" - See empty leaderboard
2. Click "Submit Score" - Try submitting a score
3. Go back to leaderboard - Score should appear

---

## 🔧 Configuration

### Environment Variables (.env)

The backend uses a `.env` file for configuration. Create it in the `backend/` folder if it doesn't exist:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=parascore_db

# Frontend
FRONTEND_URL=http://localhost:3000

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=deltatime2024

# Security
JWT_SECRET=your-secret-key-change-in-production
```

**Change these for production:**
- `ADMIN_PASSWORD` - Use a strong password
- `JWT_SECRET` - Use a random 32-character string
- `DB_PASSWORD` - Obviously not empty!

---

## 🎮 Available Games

The system comes with 3 pre-loaded games:

| ID | Name | Score Type |
|---|---|---|
| NFS | Need for Speed | Time (MM:SS:MS) |
| ALTOS | Altos Adventure | Numeric Score |
| ULTRAKILL | ULTRAKILL | Rank (S, A, B, etc.) |

---

## 📱 API Quick Reference

### Public Endpoints (No authentication)

```http
POST /api/scores/submit           # Submit a score
GET  /api/scores/leaderboard      # Get all scores
GET  /api/scores/leaderboard/:id  # Get game leaderboard
GET  /api/scores/games            # List all games
```

### Admin Endpoints (Requires JWT token)

```http
POST /api/admin/login                    # Get token
POST /api/admin/games                    # Create game
DELETE /api/admin/games/:id              # Delete game
DELETE /api/admin/scores/:id             # Delete score
DELETE /api/admin/leaderboard/:gameId    # Reset leaderboard
```

**Full documentation:** See `API_DOCUMENTATION.md`

---

## 🛠️ Common Tasks

### Reset All Data

```bash
# Delete and recreate database
mysql -u root -e "DROP DATABASE parascore_db; CREATE DATABASE parascore_db;"

# Restart backend
# (Ctrl+C to stop, then npm run dev to start)
```

### Change Admin Password

Edit `.env`:
```env
ADMIN_PASSWORD=your-new-strong-password
```

Restart the backend server.

### Add a New Game via API

First, login to get a token:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"deltatime2024"}'
```

Copy the `token` from response, then:
```bash
curl -X POST http://localhost:5000/api/admin/games \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "NEWGAME",
    "name": "New Game",
    "description": "Game description"
  }'
```

### View Database Directly

```bash
mysql -u root parascore_db
> SELECT * FROM games;
> SELECT * FROM scores;
> EXIT;
```

---

## 🐛 Troubleshooting

### "Can't connect to MySQL server"
- ✅ MySQL is running
- ✅ Credentials in `.env` are correct
- ✅ Database exists (run: `mysql -u root -e "CREATE DATABASE parascore_db;"`)

### "Port 5000 already in use"
- Change `PORT` in `.env` to `5001` or `5002`
- Or kill the process: `lsof -i :5000` (macOS/Linux)

### "Frontend can't reach backend"
- ✅ Backend is running on http://localhost:5000
- ✅ CORS is enabled (set `FRONTEND_URL` in `.env`)
- ✅ Check browser console for errors

### "Scores not submitting"
- ✅ Valid game ID (NFS, ALTOS, ULTRAKILL)
- ✅ Player name is filled
- ✅ Backend is running

### "JWT token errors"
- Log out and log back in
- Tokens expire after 24 hours
- Check `.env` JWT_SECRET matches

---

## 📊 Database Schema

### games table
```sql
id           VARCHAR(50)   - Game ID (NFS, ALTOS, etc)
name         VARCHAR(100)  - Display name
description  VARCHAR(500)  - Optional description
created_at   TIMESTAMP     - Creation date
```

### scores table
```sql
id           INT           - Score entry ID
player_name  VARCHAR(100)  - Player name
srn          VARCHAR(50)   - Student/Player ID
score        VARCHAR(100)  - Score value (flexible format)
game_id      VARCHAR(50)   - Reference to game
created_at   TIMESTAMP     - Submission date
```

---

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Change `ADMIN_PASSWORD` to strong password
- [ ] Change `JWT_SECRET` to random 32-char string
- [ ] Set `DB_PASSWORD` properly
- [ ] Set `NODE_ENV=production`
- [ ] Use real database host (not localhost)
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Set up monitoring

### Environment Variables for Production

```env
PORT=8080
NODE_ENV=production
DB_HOST=your-db-host.com
DB_USER=production_user
DB_PASSWORD=strong_password_here
DB_NAME=parascore_db_prod
FRONTEND_URL=https://yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=very_strong_password
JWT_SECRET=<generate-random-32-char-string>
```

### Deploy with PM2 (Process Manager)

```bash
npm install -g pm2

pm2 start server.js --name "parascore-api"
pm2 save
pm2 startup
```

---

## 📚 Documentation

- **QUICK_START.md** - Fast 5-minute setup
- **BACKEND_SETUP.md** - Detailed backend guide
- **API_DOCUMENTATION.md** - Complete API reference
- **API_TESTS.md** - Test examples (curl, JavaScript, Axios)

---

## 🆘 Support

When something goes wrong:

1. **Check the logs** - Look at terminal output for error messages
2. **Verify requirements** - Ensure MySQL is running, dependencies installed
3. **Test endpoints** - Use curl or Postman to test API directly
4. **Check configuration** - Verify `.env` file values
5. **Review documentation** - See relevant .md file
6. **Check database** - Run `mysql -u root parascore_db` and verify tables exist

---

## ✅ Verification Checklist

- [ ] MySQL is running
- [ ] `parascore_db` database exists
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server running on `http://localhost:5000`
- [ ] `http://localhost:5000/api/health` returns status
- [ ] Frontend running on `http://localhost:3000`
- [ ] Can submit score through frontend
- [ ] Scores appear in leaderboard
- [ ] Admin login works

---

## 🎉 You're Ready!

Once all checks pass, your ParaScore system is fully operational!

**Key URLs:**
- 🌐 Frontend: http://localhost:3000
- 🔌 Backend: http://localhost:5000
- 📊 API: http://localhost:5000/api

---

**Version:** 1.0.0  
**Last Updated:** March 2024  
**Framework:** Express.js + React  
**Database:** MySQL
