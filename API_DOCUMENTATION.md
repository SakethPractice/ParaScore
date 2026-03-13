# ParaScore API Documentation

Complete API reference for the ParaScore backend server.

**Base URL:** `http://localhost:5000/api`

---

## Table of Contents
1. [Public Endpoints](#public-endpoints)
2. [Admin Endpoints](#admin-endpoints)
3. [Response Formats](#response-formats)
4. [Error Codes](#error-codes)

---

## Public Endpoints

### 1. Health Check
Check if the server is running.

```
GET /health
```

**Response (200):**
```json
{
  "status": "Server is running"
}
```

---

### 2. Submit Score
Submit a new player score.

```
POST /scores/submit
Content-Type: application/json
```

**Request Body:**
```json
{
  "playerName": "John Doe",      // Required: Player name (max 100 chars)
  "srn": "MA20B001",              // Optional: Student/Player ID
  "game": "ALTOS",                // Required: Game ID (NFS, ALTOS, ULTRAKILL)
  "score": "45000"                // Required: Score value (can be numeric, time format, or rank)
}
```

**Response (201):**
```json
{
  "message": "Score submitted successfully",
  "scoreId": 42
}
```

**Example Requests:**

Score submission:
```bash
curl -X POST http://localhost:5000/api/scores/submit \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Alice Johnson",
    "srn": "MA20B042",
    "game": "ALTOS",
    "score": "38500"
  }'
```

Time score (Need for Speed):
```bash
curl -X POST http://localhost:5000/api/scores/submit \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "Bob Smith",
    "srn": "MA20B001",
    "game": "NFS",
    "score": "02:30:450"
  }'
```

---

### 3. Get All Leaderboards
Fetch all scores from all games (frontend filters by game).

```
GET /scores/leaderboard
```

**Response (200):**
```json
[
  {
    "id": 1,
    "playerName": "Alice Johnson",
    "srn": "MA20B042",
    "score": "38500",
    "game": "ALTOS",
    "created_at": "2024-03-13T10:30:00.000Z"
  },
  {
    "id": 2,
    "playerName": "Bob Smith",
    "srn": "MA20B001",
    "score": "42000",
    "game": "ALTOS",
    "created_at": "2024-03-13T11:15:00.000Z"
  }
]
```

**Example:**
```bash
curl http://localhost:5000/api/scores/leaderboard
```

---

### 4. Get Game-Specific Leaderboard
Fetch top 10 scores for a specific game.

```
GET /scores/leaderboard/:gameId
```

**Parameters:**
- `gameId` (string): Game ID (NFS, ALTOS, or ULTRAKILL)

**Response (200):**
```json
{
  "game": "Altos Adventure",
  "leaderboard": [
    {
      "id": 2,
      "playerName": "Bob Smith",
      "srn": "MA20B001",
      "score": "42000",
      "game": "ALTOS",
      "created_at": "2024-03-13T11:15:00.000Z"
    },
    {
      "id": 1,
      "playerName": "Alice Johnson",
      "srn": "MA20B042",
      "score": "38500",
      "game": "ALTOS",
      "created_at": "2024-03-13T10:30:00.000Z"
    }
  ]
}
```

**Example:**
```bash
curl http://localhost:5000/api/scores/leaderboard/ALTOS
```

---

### 5. Get All Games
Fetch list of available games.

```
GET /scores/games
```

**Response (200):**
```json
[
  {
    "id": "NFS",
    "name": "Need for Speed",
    "description": "Race against the clock"
  },
  {
    "id": "ALTOS",
    "name": "Altos Adventure",
    "description": "Jump and survive"
  },
  {
    "id": "ULTRAKILL",
    "name": "ULTRAKILL",
    "description": "Fast-paced action combat"
  }
]
```

**Example:**
```bash
curl http://localhost:5000/api/scores/games
```

---

## Admin Endpoints

### Authentication

All admin endpoints (except login) require JWT authentication.

Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

### 1. Admin Login
Authenticate as admin and receive a JWT token.

```
POST /admin/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "deltatime2024"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjEwMDA3Mjc3LCJleHAiOjE2MTAwOTM2Nzd9.TJVA95nM33OaM1r52Dw6q6XoETqoxic2sKmRrebAUTQ",
  "username": "admin"
}
```

**Token Expiration:** 24 hours

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "deltatime2024"
  }'
```

---

### 2. Create Game
Add a new game to the platform.

```
POST /admin/games
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "TETRIS",
  "name": "Tetris",
  "description": "Classic block-stacking game"
}
```

**Response (201):**
```json
{
  "message": "Game created successfully",
  "game": {
    "id": "TETRIS",
    "name": "Tetris",
    "description": "Classic block-stacking game"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/admin/games \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TETRIS",
    "name": "Tetris",
    "description": "Classic block-stacking game"
  }'
```

---

### 3. Delete Game
Remove a game and all its scores.

```
DELETE /admin/games/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` (string): Game ID to delete

**Response (200):**
```json
{
  "message": "Game deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/games/TETRIS \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 4. Delete Score
Remove a specific score entry.

```
DELETE /admin/scores/:id
Authorization: Bearer <token>
```

**Parameters:**
- `id` (number): Score ID to delete

**Response (200):**
```json
{
  "message": "Score deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/scores/42 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. Reset Leaderboard
Delete all scores for a specific game.

```
DELETE /admin/leaderboard/:gameId
Authorization: Bearer <token>
```

**Parameters:**
- `gameId` (string): Game ID whose leaderboard to reset

**Response (200):**
```json
{
  "message": "Leaderboard reset successfully",
  "scoresDeleted": 47
}
```

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/admin/leaderboard/ALTOS \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 6. Get All Scores (Admin)
View all scores from admin panel.

```
GET /admin/scores
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "playerName": "Alice Johnson",
    "srn": "MA20B042",
    "score": "38500",
    "game": "ALTOS",
    "created_at": "2024-03-13T10:30:00.000Z"
  },
  {
    "id": 2,
    "playerName": "Bob Smith",
    "srn": "MA20B001",
    "score": "42000",
    "game": "ALTOS",
    "created_at": "2024-03-13T11:15:00.000Z"
  }
]
```

**Example:**
```bash
curl http://localhost:5000/api/admin/scores \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Response Formats

### Success Response (2xx)
```json
{
  "message": "Operation successful",
  "data": {}
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

### Common Errors

**Invalid Game ID:**
```json
{
  "error": "Game not found"
}
```

**Missing Required Field:**
```json
{
  "error": "playerName, game, and score are required"
}
```

**Invalid Token:**
```json
{
  "error": "Invalid or expired token"
}
```

**Game Already Exists:**
```json
{
  "error": "Game id already exists"
}
```

---

## Rate Limiting

Currently, there is no rate limiting. In production, consider implementing rate limiting to prevent abuse:
- 100 requests per minute for public endpoints
- 25 requests per minute for admin endpoints

---

## CORS

The API supports CORS requests from the configured frontend URL (default: `http://localhost:3000`).

Update `FRONTEND_URL` in `.env` to allow requests from other origins.

---

## Data Types

| Type | Format | Example |
|------|--------|---------|
| Game ID | String (alphanumeric) | "ALTOS", "NFS" |
| Player Name | String (max 100) | "John Doe" |
| SRN | String (max 50) | "MA20B001" |
| Score | String (flexible) | "45000", "02:30:450", "S" |
| Timestamp | ISO 8601 | "2024-03-13T10:30:00.000Z" |

---

## Best Practices

1. **Always validate input** - Check playerName, score, and game before submitting
2. **Handle errors gracefully** - Display appropriate messages to users
3. **Cache results** - Cache leaderboard data to reduce database queries
4. **Secure tokens** - Store JWT tokens securely in the frontend
5. **Refresh tokens** - Implement token refresh for long sessions
6. **Monitor API** - Log requests and monitor for unusual activity

---

**API Version:** 1.0.0  
**Last Updated:** March 13, 2024
