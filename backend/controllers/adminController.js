const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../database/db');

/**
 * Create a new game
 * POST /api/admin/games
 * Auth: Required
 * Body: { id, name, description }
 */
const createGame = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'id and name are required' });
    }

    // Check if game already exists
    const existing = await db.query('SELECT id FROM games WHERE id = ?', [id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Game id already exists' });
    }

    // Input sanitization
    const sanitizedId = String(id).trim().substring(0, 50);
    const sanitizedName = String(name).trim().substring(0, 100);
    const sanitizedDescription = description ? String(description).trim().substring(0, 500) : null;

    await db.execute(
      'INSERT INTO games (id, name, description) VALUES (?, ?, ?)',
      [sanitizedId, sanitizedName, sanitizedDescription]
    );

    res.status(201).json({
      message: 'Game created successfully',
      game: { id: sanitizedId, name: sanitizedName, description: sanitizedDescription }
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
};

/**
 * Delete a game
 * DELETE /api/admin/games/:id
 * Auth: Required
 */
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Game id is required' });
    }

    // Check if game exists
    const game = await db.query('SELECT id FROM games WHERE id = ?', [id]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Delete game (scores will be cascade deleted)
    await db.execute('DELETE FROM games WHERE id = ?', [id]);

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ error: 'Failed to delete game' });
  }
};

/**
 * Delete a specific score
 * DELETE /api/admin/scores/:id
 * Auth: Required
 */
const deleteScore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Score id is required' });
    }

    // Check if score exists
    const score = await db.query('SELECT id FROM scores WHERE id = ?', [id]);
    if (score.length === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    await db.execute('DELETE FROM scores WHERE id = ?', [id]);

    res.status(200).json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    res.status(500).json({ error: 'Failed to delete score' });
  }
};

/**
 * Reset leaderboard for a game (delete all scores for that game)
 * DELETE /api/admin/leaderboard/:gameId
 * Auth: Required
 */
const resetLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: 'game_id is required' });
    }

    // Check if game exists
    const game = await db.query('SELECT id FROM games WHERE id = ?', [gameId]);
    if (game.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get count of scores before deletion
    const scoresBefore = await db.query(
      'SELECT COUNT(*) as count FROM scores WHERE game_id = ?',
      [gameId]
    );

    // Delete all scores for this game
    await db.execute('DELETE FROM scores WHERE game_id = ?', [gameId]);

    res.status(200).json({
      message: 'Leaderboard reset successfully',
      scoresDeleted: scoresBefore[0].count
    });
  } catch (error) {
    console.error('Error resetting leaderboard:', error);
    res.status(500).json({ error: 'Failed to reset leaderboard' });
  }
};

/**
 * Get all scores (admin view)
 * GET /api/admin/scores
 * Auth: Required
 */
const getAllScores = async (req, res) => {
  try {
    const scores = await db.query(`
      SELECT 
        s.id,
        s.player_name AS playerName,
        s.srn,
        s.score,
        s.game_id AS game,
        s.created_at
      FROM scores s
      ORDER BY s.created_at DESC
    `);

    res.status(200).json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
};

/**
 * Clean up duplicate SRNs - keep only the best score per SRN per game
 * POST /api/admin/cleanup
 * Auth: Required
 */
const cleanupDuplicates = async (req, res) => {
  try {
    let totalDeleted = 0;

    // Get all SRN and game combinations that have duplicates
    const duplicates = await db.query(`
      SELECT srn, game_id
      FROM scores
      WHERE srn IS NOT NULL
      GROUP BY srn, game_id
      HAVING COUNT(*) > 1
    `);

    console.log(`Found ${duplicates.length} SRN-game combinations with duplicates`);

    for (const dup of duplicates) {
      const { srn, game_id } = dup;
      
      // Get all scores for this SRN and game
      const scores = await db.query(
        'SELECT id, score FROM scores WHERE srn = ? AND game_id = ? ORDER BY id ASC',
        [srn, game_id]
      );

      if (scores.length <= 1) continue;

      console.log(`Processing SRN: ${srn}, Game: ${game_id}, Count: ${scores.length}`);

      // Find the best score
      let bestIndex = 0;
      let bestScore = scores[0].score;

      for (let i = 1; i < scores.length; i++) {
        const comparison = compareScores(game_id, scores[i].score, bestScore);
        if (comparison > 0) {
          bestIndex = i;
          bestScore = scores[i].score;
        }
      }

      // Delete all scores except the best one
      for (let i = 0; i < scores.length; i++) {
        if (i !== bestIndex) {
          await db.execute('DELETE FROM scores WHERE id = ?', [scores[i].id]);
          totalDeleted++;
          console.log(`Deleted score ${scores[i].id} - inferior to ${scores[bestIndex].id}`);
        }
      }
    }

    res.status(200).json({
      message: 'Duplicate cleanup completed',
      scoresDeleted: totalDeleted
    });
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    res.status(500).json({ error: 'Failed to clean up duplicates' });
  }
};

/**
 * Helper function to compare scores based on game type
 * Returns: 1 if newScore is better, -1 if existingScore is better
 */
const compareScores = (game_id, newScore, existingScore) => {
  if (game_id === 'NFS') {
    // For NFS: time format MM:SS:ms - lower is better
    const convertTimeToMs = (timeStr) => {
      const parts = String(timeStr).split(':');
      if (parts.length === 3) {
        const minutes = parseInt(parts[0]) || 0;
        const seconds = parseInt(parts[1]) || 0;
        const ms = parseInt(parts[2]) || 0;
        return minutes * 60000 + seconds * 1000 + ms;
      }
      return Infinity;
    };

    const newMs = convertTimeToMs(newScore);
    const existingMs = convertTimeToMs(existingScore);

    if (newMs < existingMs) return 1;
    if (newMs > existingMs) return -1;
    return 0;
  } else if (game_id === 'ALTOS') {
    // For ALTOS: score - higher is better
    const newVal = parseInt(newScore) || 0;
    const existingVal = parseInt(existingScore) || 0;

    if (newVal > existingVal) return 1;
    if (newVal < existingVal) return -1;
    return 0;
  } else if (game_id === 'ULTRAKILL') {
    // For ULTRAKILL: letter grade - P is best
    const gradeRanking = { 'P': 10, 'S': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 1 };
    const getGradeValue = (grade) => {
      const firstChar = String(grade).toUpperCase().charAt(0);
      return gradeRanking[firstChar] || 0;
    };
    
    const newVal = getGradeValue(newScore);
    const existingVal = getGradeValue(existingScore);

    if (newVal > existingVal) return 1;
    if (newVal < existingVal) return -1;
    return 0;
  }

  return 0;
};

module.exports = {
  createGame,
  deleteGame,
  deleteScore,
  resetLeaderboard,
  getAllScores,
  cleanupDuplicates
};
