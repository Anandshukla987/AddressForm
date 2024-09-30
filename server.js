// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, address } = req.body;

    console.log(name,address,"ghgh")
    // Insert user into User table
    db.run(`INSERT INTO User (name) VALUES (?)`, [name], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const userId = this.lastID;

        // Insert address into Address table
        db.run(`INSERT INTO Address (userId, address) VALUES (?, ?)`, [userId, address], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'User and address added successfully!' });
        });
    });
});

app.get('/users', (req, res) => {
    db.all(`SELECT User.id AS userId, User.name, Address.address
            FROM User
            LEFT JOIN Address ON User.id = Address.userId`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
