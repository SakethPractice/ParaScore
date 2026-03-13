const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'parascore_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Database initialization
const initialize = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database');

    // Drop and recreate users table to ensure proper password hashing
    await connection.execute('DROP TABLE IF EXISTS users');
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_role (role)
      )
    `);

    // Create games table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS games (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create scores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        player_name VARCHAR(100) NOT NULL,
        srn VARCHAR(50),
        score VARCHAR(100) NOT NULL,
        game_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
        INDEX idx_game (game_id),
        INDEX idx_created (created_at)
      )
    `);

    // Insert default games if they don't exist
    await connection.execute(`
      INSERT IGNORE INTO games (id, name, description) VALUES
      ('NFS', 'Need for Speed', 'Race against the clock'),
      ('ALTOS', 'Altos Adventure', 'Jump and survive'),
      ('ULTRAKILL', 'ULTRAKILL', 'Fast-paced action combat')
    `);

    // Insert default users with properly hashed passwords
    const users = [
      { username: 'admin', password: 'painoob', role: 'admin' },
      { username: 'nfs', password: 'nfs123', role: 'terminal' },
      { username: 'alto', password: 'alto123', role: 'terminal' },
      { username: 'ultrakill', password: 'ultra123', role: 'terminal' }
    ];

    for (const user of users) {
      const existingUser = await connection.execute(
        'SELECT id FROM users WHERE username = ?',
        [user.username]
      );

      if (existingUser[0].length === 0) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await connection.execute(
          'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [user.username, hashedPassword, user.role]
        );
      }
    }

    connection.release();
    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    process.exit(1);
  }
};

// Execute query with connection pool
const query = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(sql, params);
    connection.release();
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Execute query with results
const execute = async (sql, params = []) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(sql, params);
    connection.release();
    return result;
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
};

module.exports = {
  pool,
  initialize,
  query,
  execute
};
