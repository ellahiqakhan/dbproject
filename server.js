const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'itusucks', // Ensure this password matches your MySQL password
  database: 'UniVerseDB', // Make sure the database name matches your actual DB
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});

// Route for each table
app.get('/admission', (req, res) => {
  db.query('SELECT * FROM Admission', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/alumni-group', (req, res) => {
  db.query('SELECT * FROM AlumniGroup', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/contact', (req, res) => {
  db.query('SELECT * FROM Contact', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/department', (req, res) => {
  db.query('SELECT * FROM Department', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/fee-structure', (req, res) => {
  db.query('SELECT * FROM FeeStructure', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/merit-list', (req, res) => {
  db.query('SELECT * FROM MeritList', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/scholarship', (req, res) => {
  db.query('SELECT * FROM Scholarship', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});

app.get('/university', (req, res) => {
  db.query('SELECT * FROM University', (error, results) => {
    if (error) {
      console.error('Query Error:', error);
      res.status(500).send('Server Error');
    } else {
      res.json(results);
    }
  });
});
app.get('/university/:id', async (req, res) => {
  const universityId = parseInt(req.params.id, 10); // Convert ID to integer

  // SQL queries for all tables with the same ID
  const queries = {
    university: 'SELECT * FROM University WHERE ID = ?',
    admission: 'SELECT * FROM Admission WHERE UniversityID = ?',
    alumniGroup: 'SELECT * FROM AlumniGroup WHERE UniversityID = ?',
    contact: 'SELECT * FROM Contact WHERE UniversityID = ?',
    department: 'SELECT * FROM Department WHERE UniversityID = ?',
    feeStructure: 'SELECT * FROM FeeStructure WHERE UniversityID = ?',
    meritList: 'SELECT * FROM MeritList WHERE UniversityID = ?',
    scholarship: 'SELECT * FROM Scholarship WHERE UniversityID = ?',
  };

  try {
    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const [rows] = await db.promise().query(query, [universityId]);
      console.log(rows);
      results[key] = rows;
    }
    res.json(results);
  } catch (error) {
    console.error('Query Error:', error);
    res.status(500).send('Server Error');
  }
});
// Start the server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
