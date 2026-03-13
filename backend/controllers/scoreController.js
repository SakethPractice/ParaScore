const db = require('../database/db');

/**
 * Submit a new score
 * POST /api/scores/submit
 * Body: { playerName, srn, game, score }
 */
const submitScore = async (req, res) => {
  try {
    const { playerName, srn, game, score } = req.body;

    // Validation
    if (!playerName || !game || !score) {
      return res.status(400).json({ 
        error: 'playerName, game, and score are required' 
      });
    }

    // Validate game exists
    const gameCheck = await db.query(
      'SELECT id FROM games WHERE id = ?',
      [game]
    );

    if (gameCheck.length === 0) {
      return res.status(400).json({ error: 'Game not found' });
    }

    // Input sanitization - prevent SQL injection
    const sanitizedPlayerName = String(playerName).trim().substring(0, 100);
    const sanitizedSrn = srn ? String(srn).trim().substring(0, 50) : null;
    const sanitizedScore = String(score).trim().substring(0, 100);
    const sanitizedGame = String(game).trim();

    console.log(`Submitting score - Player: ${sanitizedPlayerName}, SRN: ${sanitizedSrn}, Game: ${sanitizedGame}, Score: ${sanitizedScore}`);

    // Check if SRN already has a score for this game (only if SRN is provided)
    if (sanitizedSrn) {
      const existingScores = await db.query(
        'SELECT id, score FROM scores WHERE srn = ? AND game_id = ?',
        [sanitizedSrn, sanitizedGame]
      );

      console.log(`Found ${existingScores.length} existing scores for SRN ${sanitizedSrn} in game ${sanitizedGame}`);

      if (existingScores.length > 0) {
        const existingScore = existingScores[0].score;
        console.log(`Comparing - New: ${sanitizedScore}, Existing: ${existingScore}`);

        // Determine which score is better based on game type
        let shouldDeleteExisting = false;

        if (sanitizedGame === 'NFS') {
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

          const newTimeMs = convertTimeToMs(sanitizedScore);
          const existingTimeMs = convertTimeToMs(existingScore);

          console.log(`NFS comparison - New: ${newTimeMs}ms, Existing: ${existingTimeMs}ms`);

          // If new score is better (lower), delete the existing one
          if (newTimeMs < existingTimeMs) {
            shouldDeleteExisting = true;
          }
        } else if (sanitizedGame === 'ALTOS') {
          // For ALTOS: score - higher is better
          const newScoreValue = parseInt(sanitizedScore) || 0;
          const existingScoreValue = parseInt(existingScore) || 0;

          console.log(`ALTOS comparison - New: ${newScoreValue}, Existing: ${existingScoreValue}`);

          // If new score is better (higher), delete the existing one
          if (newScoreValue > existingScoreValue) {
            shouldDeleteExisting = true;
          }
        } else if (sanitizedGame === 'ULTRAKILL') {
          // For ULTRAKILL: letter grade - P is best
          const gradeRanking = { 'P': 10, 'S': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'F': 1 };
          const getGradeValue = (grade) => {
            const firstChar = String(grade).toUpperCase().charAt(0);
            return gradeRanking[firstChar] || 0;
          };
          
          const newGradeValue = getGradeValue(sanitizedScore);
          const existingGradeValue = getGradeValue(existingScore);

          console.log(`ULTRAKILL comparison - New: ${sanitizedScore}(${newGradeValue}), Existing: ${existingScore}(${existingGradeValue})`);

          // If new grade is better (higher value), delete the existing one
          if (newGradeValue > existingGradeValue) {
            shouldDeleteExisting = true;
          }
        }

        // If new score is not better, reject the submission
        if (!shouldDeleteExisting) {
          console.log(`Score not better than existing. Rejecting submission.`);
          return res.status(400).json({ 
            error: 'This SRN already has a better score for this game' 
          });
        }

        // Delete the worse score
        console.log(`Deleting existing score ${existingScores[0].id}`);
        await db.execute(
          'DELETE FROM scores WHERE id = ?',
          [existingScores[0].id]
        );
      }
    }

    // Insert score
    console.log(`Inserting new score...`);
    const result = await db.execute(
      'INSERT INTO scores (player_name, srn, score, game_id) VALUES (?, ?, ?, ?)',
      [sanitizedPlayerName, sanitizedSrn, sanitizedScore, sanitizedGame]
    );

    console.log(`Score inserted successfully with ID ${result.insertId}`);

    res.status(201).json({
      message: 'Score submitted successfully',
      scoreId: result.insertId
    });
  } catch (error) {
    console.error('Error submitting score:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
};

/**
 * Get leaderboard (all scores)
 * GET /api/scores/leaderboard
 * Frontend filters by game on client side
 */
const getLeaderboard = async (req, res) => {
  try {
    // Get all scores with game info, sorted by creation date descending
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
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

/**
 * Get leaderboard for a specific game
 * GET /api/scores/leaderboard/:gameId
 */
const getGameLeaderboard = async (req, res) => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId is required' });
    }

    // Validate game exists
    const gameCheck = await db.query(
      'SELECT * FROM games WHERE id = ?',
      [gameId]
    );

    if (gameCheck.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Get top 10 scores for the game
    const scores = await db.query(`
      SELECT 
        s.id,
        s.player_name AS playerName,
        s.srn,
        s.score,
        s.game_id AS game,
        s.created_at
      FROM scores s
      WHERE s.game_id = ?
      ORDER BY s.created_at DESC
      LIMIT 10
    `, [gameId]);

    const game = gameCheck[0];

    res.status(200).json({
      game: game.name,
      leaderboard: scores
    });
  } catch (error) {
    console.error('Error fetching game leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

/**
 * Get all games
 * GET /api/scores/games
 */
const getAllGames = async (req, res) => {
  try {
    const games = await db.query('SELECT id, name, description FROM games');
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

module.exports = {
  submitScore,
  getLeaderboard,
  getGameLeaderboard,
  getAllGames
};
