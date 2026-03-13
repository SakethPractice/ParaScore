/**
 * ParaScore Backend - API Test Examples
 * Use these examples to test the API endpoints
 * 
 * Tools: curl, Postman, or any HTTP client
 */

// ============================================
// PUBLIC ENDPOINTS (No Authentication Required)
// ============================================

// 1. Health Check
GET http://localhost:5000/api/health

// 2. Submit a Score (ALTOS)
POST http://localhost:5000/api/scores/submit
Content-Type: application/json

{
  "playerName": "John Doe",
  "srn": "MA20B001",
  "game": "ALTOS",
  "score": "45000"
}

// 3. Submit a Time Score (Need for Speed)
POST http://localhost:5000/api/scores/submit
Content-Type: application/json

{
  "playerName": "Alice Smith",
  "srn": "MA20B042",
  "game": "NFS",
  "score": "02:30:450"
}

// 4. Submit a Rank Score (ULTRAKILL)
POST http://localhost:5000/api/scores/submit
Content-Type: application/json

{
  "playerName": "Bob Johnson",
  "srn": "MA20B015",
  "game": "ULTRAKILL",
  "score": "S"
}

// 5. Get All Leaderboards
GET http://localhost:5000/api/scores/leaderboard

// 6. Get Specific Game Leaderboard
GET http://localhost:5000/api/scores/leaderboard/ALTOS
GET http://localhost:5000/api/scores/leaderboard/NFS
GET http://localhost:5000/api/scores/leaderboard/ULTRAKILL

// 7. Get All Games
GET http://localhost:5000/api/scores/games

// ============================================
// ADMIN ENDPOINTS (Authentication Required)
// ============================================

// 1. Admin Login (Get Token)
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "username": "admin",
  "password": "deltatime2024"
}

// Response will include a token like:
// {
//   "message": "Login successful",
//   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
//   "username": "admin"
// }

// Copy the token and use it for authenticated requests below

// 2. Create a New Game (Requires Token)
POST http://localhost:5000/api/admin/games
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "id": "TETRIS",
  "name": "Tetris",
  "description": "Classic block-stacking game"
}

// 3. Delete a Game (Requires Token)
DELETE http://localhost:5000/api/admin/games/TETRIS
Authorization: Bearer YOUR_TOKEN_HERE

// 4. Get All Scores (Admin View) (Requires Token)
GET http://localhost:5000/api/admin/scores
Authorization: Bearer YOUR_TOKEN_HERE

// 5. Delete a Specific Score (Requires Token)
DELETE http://localhost:5000/api/admin/scores/1
Authorization: Bearer YOUR_TOKEN_HERE

// 6. Reset Game Leaderboard (Requires Token)
DELETE http://localhost:5000/api/admin/leaderboard/ALTOS
Authorization: Bearer YOUR_TOKEN_HERE

// ============================================
// CURL EXAMPLES
// ============================================

/**

## Health Check
curl http://localhost:5000/api/health

## Submit Score
curl -X POST http://localhost:5000/api/scores/submit \
  -H "Content-Type: application/json" \
  -d '{
    "playerName": "John Doe",
    "srn": "MA20B001",
    "game": "ALTOS",
    "score": "45000"
  }'

## Get Leaderboard
curl http://localhost:5000/api/scores/leaderboard

## Get Game Leaderboard
curl http://localhost:5000/api/scores/leaderboard/ALTOS

## Get Games
curl http://localhost:5000/api/scores/games

## Admin Login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "deltatime2024"
  }'

## Create Game (with token)
TOKEN="your_token_here"
curl -X POST http://localhost:5000/api/admin/games \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "TETRIS",
    "name": "Tetris",
    "description": "Classic block-stacking game"
  }'

## Reset Leaderboard (with token)
TOKEN="your_token_here"
curl -X DELETE http://localhost:5000/api/admin/leaderboard/ALTOS \
  -H "Authorization: Bearer $TOKEN"

*/

// ============================================
// JAVASCRIPT FETCH EXAMPLES
// ============================================

/**

// Submit a Score
async function submitScore() {
  const response = await fetch('http://localhost:5000/api/scores/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerName: 'John Doe',
      srn: 'MA20B001',
      game: 'ALTOS',
      score: '45000'
    })
  });
  
  const data = await response.json();
  console.log(data);
}

// Get Leaderboard
async function getLeaderboard() {
  const response = await fetch('http://localhost:5000/api/scores/leaderboard');
  const data = await response.json();
  console.log(data);
}

// Get Game Leaderboard
async function getGameLeaderboard(gameId) {
  const response = await fetch(`http://localhost:5000/api/scores/leaderboard/${gameId}`);
  const data = await response.json();
  console.log(data);
}

// Admin Login
async function adminLogin() {
  const response = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'deltatime2024'
    })
  });
  
  const data = await response.json();
  console.log('Token:', data.token);
  return data.token;
}

// Create Game (requires token)
async function createGame(token) {
  const response = await fetch('http://localhost:5000/api/admin/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      id: 'TETRIS',
      name: 'Tetris',
      description: 'Classic block-stacking game'
    })
  });
  
  const data = await response.json();
  console.log(data);
}

*/

// ============================================
// AXIOS EXAMPLES
// ============================================

/**

const axios = require('axios');
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Submit Score
async function submitScore() {
  try {
    const response = await API.post('/scores/submit', {
      playerName: 'John Doe',
      srn: 'MA20B001',
      game: 'ALTOS',
      score: '45000'
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

// Get Leaderboard
async function getLeaderboard() {
  try {
    const response = await API.get('/scores/leaderboard');
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

// Admin Login
async function adminLogin() {
  try {
    const response = await API.post('/admin/login', {
      username: 'admin',
      password: 'deltatime2024'
    });
    return response.data.token;
  } catch (error) {
    console.error(error.response.data);
  }
}

// Create Game with Token
async function createGame(token) {
  try {
    const response = await API.post(
      '/admin/games',
      {
        id: 'TETRIS',
        name: 'Tetris',
        description: 'Classic block-stacking game'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

*/
