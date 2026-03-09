const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Properties Table
        db.run(`CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            transactionType TEXT NOT NULL,
            category TEXT NOT NULL,
            location TEXT NOT NULL,
            price REAL NOT NULL,
            rooms INTEGER,
            area REAL,
            description TEXT,
            images TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, () => {
            // Safely add metro column if it doesn't exist yet
            db.run("ALTER TABLE properties ADD COLUMN metro TEXT", (err) => {
                // Ignore errors (column likely already exists)
            });
        });

        // Users Table for Registration/Login
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

    }
});

module.exports = db;
