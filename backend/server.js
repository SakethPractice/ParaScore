require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Function to clean up duplicate SRNs
const cleanupDuplicates = async () => {
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

    console.log(`🔍 Found ${duplicates.length} SRN-game combinations with duplicates`);

    for (const dup of duplicates) {
      const { srn, game_id } = dup;
      
      // Get all scores for this SRN and game
      const scores = await db.query(
        'SELECT id, score FROM scores WHERE srn = ? AND game_id = ? ORDER BY id ASC',
        [srn, game_id]
      );

      if (scores.length <= 1) continue;

      console.log(`  Processing SRN: ${srn}, Game: ${game_id}, Count: ${scores.length}`);

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
          console.log(`    Deleted score ID ${scores[i].id} - keeping ID ${scores[bestIndex].id}`);
        }
      }
    }

    if (totalDeleted > 0) {
      console.log(`✅ Cleanup complete: ${totalDeleted} duplicate scores removed`);
    } else {
      console.log(`✅ No duplicates found`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up duplicates:', error);
  }
};

// Helper function to compare scores
const compareScores = (game_id, newScore, existingScore) => {
  if (game_id === 'NFS') {
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
    const newVal = parseInt(newScore) || 0;
    const existingVal = parseInt(existingScore) || 0;

    if (newVal > existingVal) return 1;
    if (newVal < existingVal) return -1;
    return 0;
  } else if (game_id === 'ULTRAKILL') {
    const newVal = parseInt(newScore) || Infinity;
    const existingVal = parseInt(existingScore) || Infinity;

    if (newVal < existingVal) return 1;
    if (newVal > existingVal) return -1;
    return 0;
  }

  return 0;
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
(async () => {
  try {
    // Initialize database
    await db.initialize();
    
    // Clean up duplicate SRNs after database initialization
    await cleanupDuplicates();
    
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📊 API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();
