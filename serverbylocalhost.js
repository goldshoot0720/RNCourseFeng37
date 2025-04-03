const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Import CORS package

const app = express();
const port = 3000;

// Enable CORS to allow requests from different origins
app.use(cors());

// Enable JSON request body parsing
app.use(express.json());

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // MySQL username
  password: '',       // MySQL password (empty if no password is set)
  database: 'feng37bank',  // Database name
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// LoadData endpoint
app.post('/LoadData', (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.json({ success: false, message: 'User name is required' });
  }

  const checkUserSql = 'SELECT * FROM bankdata WHERE userName = ?';
  db.execute(checkUserSql, [userName], (err, result) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }

    if (result.length > 0) {
      const row = result[0];
      return res.json({
        success: true,
        userName: row.userName,
        bankSavings: [
          row.bank0,
          row.bank1,
          row.bank2,
          row.bank3,
          row.bank4,
          row.bank5,
          row.bank6,
          row.bank7,
          row.bank8,
          row.bank9,
        ],
      });
    } else {
      return res.json({ success: false, message: 'User not found' });
    }
  });
});

// SaveData endpoint
app.post('/SaveData', (req, res) => {
  const { userName, bankSavings } = req.body;

  if (!userName || !Array.isArray(bankSavings)) {
    return res.json({ success: false, message: 'Invalid data' });
  }

  const checkUserSql = 'SELECT * FROM bankdata WHERE userName = ?';
  db.execute(checkUserSql, [userName], (err, result) => {
    if (err) {
      return res.json({ success: false, message: 'Database error' });
    }

    if (result.length > 0) {
      const updateSql = `UPDATE bankdata SET 
                          bank0 = ?, bank1 = ?, bank2 = ?, bank3 = ?, bank4 = ?, 
                          bank5 = ?, bank6 = ?, bank7 = ?, bank8 = ?, bank9 = ? 
                          WHERE userName = ?`;

      db.execute(updateSql, [
        ...bankSavings,
        userName,
      ], (err, result) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to update data' });
        }
        return res.json({ success: true, message: 'Data updated successfully' });
      });
    } else {
      const insertSql = `INSERT INTO bankdata (userName, bank0, bank1, bank2, bank3, bank4, bank5, bank6, bank7, bank8, bank9) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.execute(insertSql, [
        userName,
        ...bankSavings,
      ], (err, result) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to insert data' });
        }
        return res.json({ success: true, message: 'Data inserted successfully' });
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
