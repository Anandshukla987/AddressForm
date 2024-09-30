// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, address } = req.body;

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

// Route to fetch users and their addresses
app.get('/users', (req, res) => {
    db.all(`SELECT User.id AS userId, User.name, Address.address
            FROM User
            LEFT JOIN Address ON User.id = Address.userId`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        // Transform the data to group addresses under their respective users
        const users = {};
        rows.forEach(row => {
            if (!users[row.userId]) {
                users[row.userId] = {
                    id: row.userId,
                    name: row.name,
                    addresses: []
                };
            }
            if (row.address) {
                users[row.userId].addresses.push(row.address);
            }
        });

        res.json(Object.values(users)); // Return users as an array
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
