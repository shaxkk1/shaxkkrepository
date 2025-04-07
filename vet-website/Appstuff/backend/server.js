import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Change the port number from 5000 to something else, like 5001
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ServantsLog',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 as test');
    res.json({ message: 'Database connection successful', data: rows });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Get all veterans
app.get('/api/veterans', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.*, r.RankName, b.BranchName, c.ConflictName 
      FROM Veterans v
      LEFT JOIN Ranks r ON v.RankID = r.RankID
      LEFT JOIN Branches b ON v.BranchID = b.BranchID
      LEFT JOIN Conflicts c ON v.ConflictID = c.ConflictID
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching veterans:', error);
    res.status(500).json({ message: 'Error fetching veterans', error: error.message });
  }
});

// Get veterans by branch
app.get('/api/veterans/branch/:branchName', async (req, res) => {
  try {
    const branchName = req.params.branchName;
    const [rows] = await pool.query(`
      SELECT v.*, r.RankName, b.BranchName, c.ConflictName 
      FROM Veterans v
      LEFT JOIN Ranks r ON v.RankID = r.RankID
      LEFT JOIN Branches b ON v.BranchID = b.BranchID
      LEFT JOIN Conflicts c ON v.ConflictID = c.ConflictID
      WHERE b.BranchName = ?
    `, [branchName]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching veterans by branch:', error);
    res.status(500).json({ message: 'Error fetching veterans by branch', error: error.message });
  }
});

// Get all branches
app.get('/api/branches', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Branches');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ message: 'Error fetching branches', error: error.message });
  }
});

// Get all ranks
app.get('/api/ranks', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Ranks');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ranks:', error);
    res.status(500).json({ message: 'Error fetching ranks', error: error.message });
  }
});

// Get all conflicts
app.get('/api/conflicts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Conflicts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching conflicts:', error);
    res.status(500).json({ message: 'Error fetching conflicts', error: error.message });
  }
});

// Add a new veteran
app.post('/api/veterans', async (req, res) => {
  try {
    const { firstName, lastName, middleName, dateOfBirth, dateOfDeath, rankID, branchID, serviceStartDate, serviceEndDate, conflictID } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO Veterans (FirstName, LastName, MiddleName, DateOfBirth, DateOfDeath, RankID, BranchID, ServiceStartDate, ServiceEndDate, ConflictID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, middleName, dateOfBirth, dateOfDeath, rankID, branchID, serviceStartDate, serviceEndDate, conflictID]
    );
    
    res.status(201).json({ message: 'Veteran added successfully', veteranID: result.insertId });
  } catch (error) {
    console.error('Error adding veteran:', error);
    res.status(500).json({ message: 'Error adding veteran', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});