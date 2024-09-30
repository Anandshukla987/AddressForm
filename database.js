// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
    if (err) {
        console.error(err.message);
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        address TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES User(id)
    )`);
});

module.exports = db;
