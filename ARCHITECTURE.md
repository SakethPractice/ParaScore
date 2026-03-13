# 🏗️ ParaScore Architecture & Data Flow

This document explains how the frontend and backend interact.

---

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌────────────────────────────────────────────────────────│    │
│  │                                                          │    │
│  │            Frontend (React + Vite)                     │    │
│  │         http://localhost:3000                          │    │
│  │                                                          │    │
│  │  ┌──────────────────────────────────────────────┐      │    │
│  │  │            React Components                  │      │    │
│  │  │  • Home.jsx (Landing)                        │      │    │
│  │  │  • LeaderboardPage.jsx (View scores)         │      │    │
│  │  │  • SubmitScore.jsx (Submit score)            │      │    │
│  │  │  • AdminLogin.jsx (Admin panel)              │      │    │
│  │  └──────────────────────────────────────────────┘      │    │
│  │                      ↓                                   │    │
│  │  ┌──────────────────────────────────────────────┐      │    │
│  │  │      Axios HTTP Client (api.js)              │      │    │
│  │  │  Base URL: http://localhost:5000/api         │      │    │
│  │  └──────────────────────────────────────────────┘      │    │
│  └────────────────────────────────────────────────────────│    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                           ↓↑ HTTP/REST
                    (JSON Request/Response)
                           ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND SERVER                               │
│                                                                 │
│        Express.js API                                          │
│    http://localhost:5000                                       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │          REQUEST ROUTING (Routes)                     │   │
│  │                                                        │   │
│  │  • scoreRoutes.js (public endpoints)                 │   │
│  │  • adminRoutes.js (protected endpoints)              │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                      ↓↑                                         │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │          CONTROLLERS (Business Logic)                 │   │
│  │                                                        │   │
│  │  • scoreController.js (Manage scores)                │   │
│  │  • adminController.js (Manage games)                 │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                      ↓↑                                         │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │        MIDDLEWARE (Authentication)                    │   │
│  │                                                        │   │
│  │  • authMiddleware.js (JWT verification)              │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                      ↓↑                                         │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                        │   │
│  │      DATABASE CONNECTION (MySQL)                      │   │
│  │                                                        │   │
│  │  • db.js (Connection pool)                           │   │
│  │                                                        │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                           ↓↑ SQL Queries
                   (Read/Write Data)
                           ↓↑
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    MySQL DATABASE                              │
│              parascore_db (localhost:3306)                     │
│                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────────┐   │
│  │   games table        │      │   scores table           │   │
│  ├──────────────────────┤      ├──────────────────────────┤   │
│  │ id (PK)              │      │ id (PK)                  │   │
│  │ name                 │      │ player_name              │   │
│  │ description          │      │ srn                      │   │
│  │ created_at           │      │ score                    │   │
│  │                      │      │ game_id (FK → games.id)  │   │
│  │ DEFAULT GAMES:       │      │ created_at               │   │
│  │ • NFS                │      │                          │   │
│  │ • ALTOS              │      │ INDEXES:                 │   │
│  │ • ULTRAKILL          │      │ • game_id                │   │
│  │                      │      │ • created_at             │   │
│  │                      │      │ • player_name            │   │
│  └──────────────────────┘      └──────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📡 API Endpoints Map

### PUBLIC ENDPOINTS (No Authentication)

```
┌─────────────────────────────────────────────────────────────┐
│                    Score Management                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 1. Submit Score                                            │
│    POST /api/scores/submit                                │
│    Body: {playerName, srn, game, score}                   │
│    Response: {message, scoreId}                           │
│                                                             │
│ 2. Get All Leaderboards                                   │
│    GET /api/scores/leaderboard                            │
│    Response: Array of all scores                          │
│                                                             │
│ 3. Get Game Leaderboard                                   │
│    GET /api/scores/leaderboard/:gameId                    │
│    Response: {game, leaderboard: [{...scores}]}           │
│                                                             │
│ 4. Get All Games                                          │
│    GET /api/scores/games                                  │
│    Response: Array of {id, name, description}            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### PROTECTED ENDPOINTS (JWT Required)

```
┌──────────────────────────────────────────────────────────┐
│              Admin Operations                            │
├──────────────────────────────────────────────────────────┤
│ Header: Authorization: Bearer <token>                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 1. Login (Get Token)                                    │
│    POST /api/admin/login (PUBLIC - no token)           │
│    Body: {username, password}                          │
│    Response: {message, token, username}                │
│                                                          │
│ 2. Create Game                                         │
│    POST /api/admin/games                               │
│    Body: {id, name, description}                       │
│    Response: {message, game}                           │
│                                                          │
│ 3. Delete Game                                         │
│    DELETE /api/admin/games/:id                         │
│    Response: {message}                                 │
│                                                          │
│ 4. Delete Score                                        │
│    DELETE /api/admin/scores/:id                        │
│    Response: {message}                                 │
│                                                          │
│ 5. Reset Leaderboard                                   │
│    DELETE /api/admin/leaderboard/:gameId               │
│    Response: {message, scoresDeleted}                  │
│                                                          │
│ 6. Get All Scores (Admin View)                         │
│    GET /api/admin/scores                               │
│    Response: Array of all scores with details          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Examples

### Flow 1: Submitting a Score

```
USER ACTION: Player submits score
        │
        ↓
React (SubmitScore.jsx)
  │ validates input
  │ checks for cheating
  │ calls API.post("/scores/submit", data)
        │
        ↓
Express Server
  │ receives POST request
  │ scoreController.submitScore()
  │ validates: playerName, score, game
  │ sanitizes input (prevent SQL injection)
  │ checks if game exists
        │
        ↓
Database (scores table)
  │ INSERT INTO scores 
  │   (player_name, srn, score, game_id, created_at)
  │ VALUES (?, ?, ?, ?, NOW())
        │
        ↓
Response sent back to frontend
  │ {message: "Score submitted successfully", scoreId: 42}
        │
        ↓
Frontend
  │ shows success message
  │ redirects after 3 seconds
  │ clears form
```

### Flow 2: Viewing Leaderboard

```
USER ACTION: Click "View Leaderboard"
        │
        ↓
React (LeaderboardPage.jsx)
  │ on component mount
  │ sets activeGame = "NFS"
  │ calls API.get("/scores/leaderboard")
  │ every 3 seconds: loadScores()
        │
        ↓
Express Server
  │ scoreController.getLeaderboard()
  │ SELECT * FROM scores
  │ ORDER BY created_at DESC
        │
        ↓
Database returns all scores
        │
        ↓
Response sent to frontend
  │ Array of [{id, playerName, srn, score, game, created_at}, ...]
        │
        ↓
Frontend processes response
  │ filters: scores where score.game === activeGame
  │ sorts: by score descending
  │ takes: top 5 scores
  │ adds ranks: 1st, 2nd, 3rd, 4th, 5th
  │ renders with medals and animations
```

### Flow 3: Admin Management

```
ADMIN ACTION: Login
        │
        ↓
React (AdminLogin.jsx)
  │ user enters username & password
  │ API.post("/admin/login", {username, password})
        │
        ↓
Express Server
  │ adminController.adminLogin()
  │ checks: username === "admin"
  │ checks: password === "deltatime2024"
        │
        ↓
Generate JWT Token
  │ jwt.sign({username, role), SECRET, {expiresIn: "24h"})
        │
        ↓
Response to frontend
  │ {message, token: "eyJ...", username}
        │
        ↓
Frontend (AdminLogin)
  │ stores token (could use localStorage)
  │ shows admin panel
        │
        ↓
ADMIN ACTION: Reset Leaderboard
  │ clicks "Reset ALTOS"
  │ API.delete("/admin/leaderboard/ALTOS",
  │   {headers: {Authorization: "Bearer " + token}})
        │
        ↓
Express Server
  │ authMiddleware checks token
  │ verifies token is valid
  │ adminController.resetLeaderboard("ALTOS")
  │ DELETE FROM scores WHERE game_id = "ALTOS"
        │
        ↓
Database
  │ rows deleted: 47
        │
        ↓
Response
  │ {message, scoresDeleted: 47}
        │
        ↓
Frontend
  │ shows success
  │ updates leaderboard view
```

---

## 🔐 Security Flow

### JWT Authentication Process

```
1. ADMIN LOGIN (First time)
   ├─ POST /api/admin/login (no token needed)
   ├─ Body: {username: "admin", password: "deltatime2024"}
   └─ Response: {token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

2. STORE TOKEN (Frontend)
   ├─ Save token to localStorage or state
   └─ Include in future requests

3. Make Protected Request
   ├─ GET /api/admin/scores
   ├─ Header: Authorization: Bearer eyJhbGciOi...
   └─ Body: (none)

4. SERVER MIDDLEWARE CHECK (authMiddleware.js)
   ├─ Extract token from Authorization header
   ├─ Call jwt.verify(token, JWT_SECRET)
   ├─ IF valid: req.user = {username, role}; next()
   └─ IF invalid: 401 Unauthorized response

5. CONTINUE TO CONTROLLER
   ├─ Controller now has req.user info
   ├─ Execute admin operation
   └─ Return response

6. TOKEN EXPIRY
   ├─ After 24 hours, token expires
   ├─ Client gets: 401 "Invalid or expired token"
   └─ User must login again to get new token
```

---

## 📊 Database Relationships

```
games                              scores
┌──────────────────────┐          ┌──────────────────────┐
│ id (VARCHAR 50)      │          │ id (INT)             │
│ name (VARCHAR 100)   │ 1──────N │ player_name (VARCHAR)│
│ description          │   ↓ ↑    │ srn (VARCHAR 50)     │
│ created_at           │ game_id  │ score (VARCHAR 100)  │
└──────────────────────┘          │ game_id (FK)         │
                                   │ created_at           │
                                   └──────────────────────┘

Relationship: 1 Game → Many Scores (One-to-Many)
Delete Game → All related scores deleted (CASCADE)
```

---

## 🎮 Game Types & Score Examples

| Game | ID | Score Type | Example | Notes |
|------|----|----|------|----|
| Need for Speed | NFS | Time | 02:30:450 | Lower is better |
| Altos Adventure | ALTOS | Numeric | 45000 | Higher is better |
| ULTRAKILL | ULTRAKILL | Rank | S, A, B, C | S is best |

---

## 🚀 Request/Response Examples

### Request 1: Submit Score
```http
POST http://localhost:5000/api/scores/submit
Content-Type: application/json

{
  "playerName": "John Doe",
  "srn": "MA20B001",
  "game": "ALTOS",
  "score": "45000"
}
```

**Response:**
```json
{
  "message": "Score submitted successfully",
  "scoreId": 42
}
```

### Request 2: Get Leaderboard
```http
GET http://localhost:5000/api/scores/leaderboard/ALTOS
```

**Response:**
```json
{
  "game": "Altos Adventure",
  "leaderboard": [
    {
      "id": 42,
      "playerName": "John Doe",
      "srn": "MA20B001",
      "score": "45000",
      "game": "ALTOS",
      "created_at": "2024-03-13T10:30:00.000Z"
    },
    {
      "id": 41,
      "playerName": "Alice Johnson",
      "srn": "MA20B042",
      "score": "38500",
      "game": "ALTOS",
      "created_at": "2024-03-13T09:15:00.000Z"
    }
  ]
}
```

### Request 3: Admin Login
```http
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "deltatime2024"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjEwMDA3Mjc3LCJleHAiOjE2MTAwOTM2Nzd9.TJVA95nM33OaM1r52Dw6q6XoETqoxic2sKmRrebAUTQ",
  "username": "admin"
}
```

---

## 🔄 Component Interaction

```
Frontend (React)              Backend (Express)           Database (MySQL)
─────────────────────────────────────────────────────────────────
                │
HomeComponent   │
    └─→ Click "View Leaderboard" 
                │─────────────────→ GET /scores/leaderboard
                │                      │────────────────────→ SELECT * FROM scores
                │                      │
                │                      │←────────────────── [all scores]
                │←────────────────── JSON array
                │
        Display & Filter scores
                │
        Every 3 sec:
                │─────────────────→ GET /scores/leaderboard
                │                      │────────────────────→ SELECT * FROM scores
                │                      │
                │                      │←────────────────── [scores]
                │←────────────────── JSON array
                │
        Update display
                │
                │
SubmitComponent │
    └─→ User fills form
                │─────────────────→ POST /scores/submit
                │                      │└─ Validate input
                │                      │
                │                      │────────────────────→ INSERT INTO scores
                │                      │
                │                      │←────────────────── {insertId}
                │←────────────────── {message, scoreId}
                │
        Show success
        Clear form
                │
                │
AdminComponent  │
    └─→ Click "Login"
                │─────────────────→ POST /admin/login
                │                      │└─ Check credentials
                │                      │
                │←────────────────── {token}
                │
        Save token
        Show admin panel
                │
                │─────────────────→ DELETE /admin/leaderboard/ALTOS
                │                      │└─ authMiddleware: verify token
                │                      │
                │                      │────────────────────→ DELETE FROM scores
                │                      │
                │                      │←────────────────── rows deleted
                │←────────────────── {message}
                │
        Update display
```

---

## 📝 Summary

The architecture follows a **classic three-tier pattern**:

1. **Presentation Tier** - React frontend (client-side)
2. **Application Tier** - Express.js backend (server-side)
3. **Data Tier** - MySQL database (storage)

**Communication:** REST API with JSON payloads over HTTP
**Security:** JWT tokens for admin operations
**Database:** MySQL with proper indexing and relationships
**Scalability:** Connection pooling for database performance

---

**Document Version:** 1.0  
**Last Updated:** March 13, 2024
