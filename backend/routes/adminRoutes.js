const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGame,
  deleteGame,
  deleteScore,
  resetLeaderboard,
  getAllScores,
  cleanupDuplicates
} = require('../controllers/adminController');

/**
 * Admin endpoints - All require JWT authentication
 */

// Protected routes - require JWT token
router.use(authMiddleware);

// GET /api/admin/scores - Get all scores
router.get('/scores', getAllScores);

// POST /api/admin/cleanup - Clean up duplicate SRNs
router.post('/cleanup', cleanupDuplicates);

// POST /api/admin/games - Create a new game
router.post('/games', createGame);

// DELETE /api/admin/games/:id - Delete a game
router.delete('/games/:id', deleteGame);

// DELETE /api/admin/scores/:id - Delete a specific score
router.delete('/scores/:id', deleteScore);

// DELETE /api/admin/leaderboard/:gameId - Reset leaderboard
router.delete('/leaderboard/:gameId', resetLeaderboard);

module.exports = router;
