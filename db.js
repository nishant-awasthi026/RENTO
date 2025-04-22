
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'nishant',
  password: 'mySQL123@',
  database: 'rento_db'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit if cannot connect to database
  }
};

// Initialize database
const initDb = async () => {
  try {
    await testConnection();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

// Call init function
initDb();

// Export the pool to be used in other files
export { pool as db };
