// server.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // Your MySQL username
    password: '',         // Your MySQL password
    database: 'travally'  // Make sure this DB is created
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ MySQL connected...');
});

// Create users table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    )
`);

// ===== Signup Endpoint =====
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hashedPassword], (err, result) => {
            if (err) return res.status(400).json({ error: err.sqlMessage });
            res.status(201).json({ message: 'User created successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ===== Login Endpoint =====
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token });
    });
});

// ===== Admin: Get All Users =====
app.get('/api/users', (req, res) => {
    db.query('SELECT id, name, email FROM users', (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(results);
    });
});

// ===== Admin: Delete a User by ID =====
app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json({ message: 'User deleted successfully' });
    });
});

// ===== Start Server =====
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
