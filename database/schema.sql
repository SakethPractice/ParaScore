-- ParaScore Database Schema
-- This file contains the complete database structure
-- The backend will automatically create these tables on first run
-- You can also run this manually if needed

-- Create database
CREATE DATABASE IF NOT EXISTS parascore_db;
USE parascore_db;

-- Games table: Stores information about each game
CREATE TABLE IF NOT EXISTS games (
  id VARCHAR(50) PRIMARY KEY COMMENT 'Game identifier (e.g., NFS, ALTOS, ULTRAKILL)',
  name VARCHAR(100) NOT NULL COMMENT 'Display name of the game',
  description VARCHAR(500) COMMENT 'Optional game description',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the game was added',
  KEY idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Games available on the platform';

-- Scores table: Stores all submitted scores
CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Score entry ID',
  player_name VARCHAR(100) NOT NULL COMMENT 'Player name',
  srn VARCHAR(50) COMMENT 'Student registration number or player ID',
  score VARCHAR(100) NOT NULL COMMENT 'Score value (can be numeric, time, or rank)',
  game_id VARCHAR(50) NOT NULL COMMENT 'Reference to game',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'When the score was submitted',
  
  -- Foreign key constraint
  CONSTRAINT fk_game_id FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  
  -- Indexes for performance
  KEY idx_game (game_id),
  KEY idx_created (created_at),
  KEY idx_player (player_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Player scores for each game';

-- Insert default games
INSERT IGNORE INTO games (id, name, description) VALUES
('NFS', 'Need for Speed', 'Race against the clock in this fast-paced driving game'),
('ALTOS', 'Altos Adventure', 'Jump and navigate through beautiful obstacles'),
('ULTRAKILL', 'ULTRAKILL', 'Fast-paced action combat with intense gameplay');

-- Create indexes
CREATE INDEX idx_game_created ON scores(game_id, created_at);
CREATE INDEX idx_player_score ON scores(player_name, score);

-- Display confirmation
SELECT 'Database setup complete!' AS status;
SELECT COUNT(*) as total_games FROM games;
