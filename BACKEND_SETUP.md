# ParaScore Backend - Setup Guide

This is the backend server for the ParaScore leaderboard application. It provides REST API endpoints for managing games, submitting scores, and admin operations.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Database Setup](#database-setup)
4. [Configuration](#configuration)
5. [Running the Server](#running-the-server)
6. [API Endpoints](#api-endpoints)
7. [Environment Variables](#environment-variables)
8. [Project Structure](#project-structure)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/mysql/)
- **npm** (comes with Node.js)

Verify installations:
```bash
node --version
npm --version
mysql --version
```

---

## Installation

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

This will install:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `mysql2` - MySQL database driver
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `dotenv` - Environment variable management
- `nodemon` - Development auto-restart

---

## Database Setup

### 1. Create MySQL Database

Open MySQL Command Line or MySQL Workbench and run:

```sql
CREATE DATABASE parascore_db;
```

Or using MySQL command line:
```bash
mysql -u root -p
```

Then in the MySQL prompt:
```sql
CREATE DATABASE parascore_db;
EXIT;
```

### 2. Database Tables

The backend will automatically create the required tables on first run:

**games table:**
```sql
CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**scores table:**
```sql
CREATE TABLE scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_name VARCHAR(100) NOT NULL,
  srn VARCHAR(50),
  score VARCHAR(100) NOT NULL,
  game_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```

### 3. Default Games

The server automatically inserts these games on startup:
- **NFS** - Need for Speed
- **ALTOS** - Altos Adventure
- **ULTRAKILL** - ULTRAKILL

---

## Configuration

### 1. Create .env file

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 2. Configure Database Connection

Edit `.env` and update MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=parascore_db
```

### 3. Configure Frontend URL

Update CORS origin:
```env
FRONTEND_URL=http://localhost:3000
```

### 4. Configure Admin Credentials

The default credentials are:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=deltatime2024
```

For production, change these values and use strong passwords.

### 5. Set JWT Secret

For production, change the JWT secret:
```env
JWT_SECRET=your-very-strong-secret-key-here
```

---

## Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

The server will watch for file changes and automatically restart.

### Production Mode

```bash
npm start
```

### Output

When the server starts successfully, you'll see:
```
✅ Connected to MySQL database
✅ Database tables initialized
✅ Server running on http://localhost:5000
📊 API available at http://localhost:5000/api
```

---

## API Endpoints

### Health Check
- **GET** `/api/health` - Server status

### Public Score Endpoints
- **POST** `/api/scores/submit` - Submit a new score
- **GET** `/api/scores/leaderboard` - Get all scores
- **GET** `/api/scores/leaderboard/:gameId` - Get scores for a specific game
- **GET** `/api/scores/games` - Get all available games

### Admin Endpoints (Require JWT Token)
- **POST** `/api/admin/login` - Admin authentication
- **POST** `/api/admin/games` - Create a new game
- **DELETE** `/api/admin/games/:id` - Delete a game
- **DELETE** `/api/admin/scores/:id` - Delete a specific score
- **DELETE** `/api/admin/leaderboard/:gameId` - Reset game leaderboard
- **GET** `/api/admin/scores` - Get all scores (admin view)

---

## Detailed API Documentation

### 1. Submit Score

```http
POST /api/scores/submit
Content-Type: application/json

{
  "playerName": "John Doe",
  "srn": "MA20B001",
  "game": "ALTOS",
  "score": "45000"
}
```

**Response (201):**
```json
{
  "message": "Score submitted successfully",
  "scoreId": 1
}
```

### 2. Get All Scores

```http
GET /api/scores/leaderboard
```

**Response (200):**
```json
[
  {
    "id": 1,
    "playerName": "John Doe",
    "srn": "MA20B001",
    "score": "45000",
    "game": "ALTOS",
    "created_at": "2024-03-13T10:30:00.000Z"
  }
]
```

### 3. Get Game Leaderboard

```http
GET /api/scores/leaderboard/ALTOS
```

**Response (200):**
```json
{
  "game": "Altos Adventure",
  "leaderboard": [
    {
      "id": 1,
      "playerName": "John Doe",
      "srn": "MA20B001",
      "score": "45000",
      "game": "ALTOS",
      "created_at": "2024-03-13T10:30:00.000Z"
    }
  ]
}
```

### 4. Admin Login

```http
POST /api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "deltatime2024"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "admin"
}
```

### 5. Create Game (Admin)

```http
POST /api/admin/games
Authorization: Bearer <token>
Content-Type: application/json

{
  "id": "GAME123",
  "name": "New Game",
  "description": "Game description"
}
```

**Response (201):**
```json
{
  "message": "Game created successfully",
  "game": {
    "id": "GAME123",
    "name": "New Game",
    "description": "Game description"
  }
}
```

### 6. Reset Leaderboard (Admin)

```http
DELETE /api/admin/leaderboard/ALTOS
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Leaderboard reset successfully",
  "scoresDeleted": 42
}
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Runtime environment |
| `DB_HOST` | localhost | MySQL host |
| `DB_USER` | root | MySQL username |
| `DB_PASSWORD` | (empty) | MySQL password |
| `DB_NAME` | parascore_db | Database name |
| `FRONTEND_URL` | http://localhost:3000 | Frontend CORS origin |
| `ADMIN_USERNAME` | admin | Admin login username |
| `ADMIN_PASSWORD` | deltatime2024 | Admin login password |
| `JWT_SECRET` | your-secret-key | JWT signing secret |

---

## Project Structure

```
backend/
├── controllers/
│   ├── scoreController.js      # Score submission & retrieval logic
│   └── adminController.js      # Admin management logic
├── routes/
│   ├── scoreRoutes.js          # Public score endpoints
│   └── adminRoutes.js          # Admin endpoints
├── middleware/
│   └── authMiddleware.js       # JWT authentication
├── database/
│   └── db.js                   # MySQL connection & initialization
├── server.js                   # Express server setup
├── package.json                # Dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

---

## Common Issues & Troubleshooting

### 1. MySQL Connection Error
**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
- Ensure MySQL is running
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify database name exists

```bash
# Check MySQL status
mysql -u root -p
```

### 2. Port Already in Use
**Error:** `Error: listen EADDRINUSE :::5000`

**Solution:**
- Change PORT in .env
- Or kill the process using port 5000:

```bash
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### 3. CORS Error
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify FRONTEND_URL in .env matches your frontend URL
- Ensure frontend is running on specified port

### 4. JWT Token Errors
**Error:** `Invalid or expired token`

**Solution:**
- Use the token from login endpoint
- Token expires in 24 hours
- Log in again to get a new token

### 5. 404 Game Not Found
**Error:** `Game not found when submitting score`

**Solution:**
- Only submit scores for existing games: NFS, ALTOS, ULTRAKILL
- Check game ID spelling (case-sensitive)

---

## Performance Tips

### 1. Database Indexing
The schema includes indexes on:
- `game_id` - Fast game filtering
- `created_at` - Fast sorting by date

### 2. Connection Pool
The backend uses a connection pool (max 10 connections) for better concurrency.

### 3. Query Optimization
- Leaderboard queries use LIMIT 10
- Proper indexes on foreign keys
- SELECT only required columns

---

## Production Deployment

When deploying to production:

1. **Change admin credentials** in .env
2. **Use strong JWT_SECRET** - generate with:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Enable HTTPS** - use a reverse proxy like nginx
4. **Set NODE_ENV=production**
5. **Use environment-specific database backup**
6. **Monitor logs and errors**
7. **Rate limit endpoints** to prevent abuse
8. **Use environment variables for all secrets**

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Verify .env configuration
4. Check MySQL is running
5. Ensure frontend is on correct port

---

**Version:** 1.0.0  
**Last Updated:** March 2024
