const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'makler_secret_key_123';
const USER_SECRET_KEY = 'makler_user_secret_123';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Static folder for images
app.use('/uploads', express.static(uploadDir));

// Multer setup for multiple image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Admin Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Feqan' && password === 'Feqan1234F') {
        const token = jwt.sign({ admin: true }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yalnışdır' });
});

// Middleware to protect admin routes
const authAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Yetkisiz giriş' });
            req.admin = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token tapılmadı' });
    }
};

// USER AUTH ENTPOINTS
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Məlumatları tam doldurun' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ success: false, message: 'Bu istifadəçi adı artıq mövcuddur' });
                }
                return res.status(500).json({ success: false, message: err.message });
            }
            res.json({ success: true, message: 'Qeydiyyat uğurla tamamlandı' });
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server xətası' });
    }
});

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (!user) return res.status(401).json({ success: false, message: 'İstifadəçi tapılmadı' });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user.id, username: user.username }, USER_SECRET_KEY, { expiresIn: '7d' });
            res.json({ success: true, token, username: user.username });
        } else {
            res.status(401).json({ success: false, message: 'Şifrə yalnışdır' });
        }
    });
});


// API Routes for Properties
app.get('/api/properties', (req, res) => {
    let query = 'SELECT * FROM properties WHERE 1=1';
    let params = [];

    if (req.query.transactionType) {
        query += ' AND transactionType = ?';
        params.push(req.query.transactionType);
    }
    if (req.query.category) {
        query += ' AND category = ?';
        params.push(req.query.category);
    }
    if (req.query.location) {
        query += ' AND location = ?';
        params.push(req.query.location);
    }
    if (req.query.priceMin) {
        query += ' AND price >= ?';
        params.push(req.query.priceMin);
    }
    if (req.query.metro) {
        query += ' AND metro = ?';
        params.push(req.query.metro);
    }
    if (req.query.priceMax) {
        query += ' AND price <= ?';
        params.push(req.query.priceMax);
    }
    if (req.query.searchQuery) {
        query += ' AND (title LIKE ? OR location LIKE ? OR description LIKE ?)';
        const likeSearch = `%${req.query.searchQuery}%`;
        params.push(likeSearch, likeSearch, likeSearch);
    }

    query += ' ORDER BY createdAt DESC';

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const properties = rows.map(row => ({
            ...row,
            images: row.images ? JSON.parse(row.images) : []
        }));
        res.json({ properties });
    });
});

app.get('/api/properties/:id', (req, res) => {
    db.get('SELECT * FROM properties WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Property not found' });
        res.json({
            property: {
                ...row,
                images: row.images ? JSON.parse(row.images) : []
            }
        });
    });
});

app.post('/api/properties', authAdmin, upload.array('images', 15), (req, res) => {
    const { title, transactionType, category, location, price, rooms, area, description, metro } = req.body;
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const imagesJson = JSON.stringify(imagePaths);
    const sql = `INSERT INTO properties (title, transactionType, category, location, price, rooms, area, description, images, metro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [title, transactionType, category, location, price, rooms || null, area || null, description, imagesJson, metro || null];
    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.status(201).json({ message: 'Property created successfully', id: this.lastID, property: { id: this.lastID, ...req.body, images: imagePaths } });
    });
});

app.put('/api/properties/:id', authAdmin, upload.array('images', 15), (req, res) => {
    const { title, transactionType, category, location, price, rooms, area, description, metro } = req.body;
    let sql = '';
    let params = [];

    if (req.files && req.files.length > 0) {
        const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
        const imagesJson = JSON.stringify(imagePaths);
        sql = `UPDATE properties SET title = COALESCE(?, title), transactionType = COALESCE(?, transactionType), category = COALESCE(?, category), location = COALESCE(?, location), price = COALESCE(?, price), rooms = COALESCE(?, rooms), area = COALESCE(?, area), description = COALESCE(?, description), images = ?, metro = COALESCE(?, metro) WHERE id = ?`;
        params = [title, transactionType, category, location, price, rooms || null, area || null, description, imagesJson, metro || null, req.params.id];
    } else {
        sql = `UPDATE properties SET title = COALESCE(?, title), transactionType = COALESCE(?, transactionType), category = COALESCE(?, category), location = COALESCE(?, location), price = COALESCE(?, price), rooms = COALESCE(?, rooms), area = COALESCE(?, area), description = COALESCE(?, description), metro = COALESCE(?, metro) WHERE id = ?`;
        params = [title, transactionType, category, location, price, rooms || null, area || null, description, metro || null, req.params.id];
    }

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Property not found' });
        res.json({ message: 'Property updated successfully' });
    });
});

app.delete('/api/properties/:id', authAdmin, (req, res) => {
    db.get('SELECT images FROM properties WHERE id = ?', [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row && row.images) {
            const images = JSON.parse(row.images);
            images.forEach(imgPath => {
                const imgPathOnDisk = path.join(__dirname, imgPath);
                if (fs.existsSync(imgPathOnDisk)) fs.unlinkSync(imgPathOnDisk);
            });
        }
        db.run('DELETE FROM properties WHERE id = ?', [req.params.id], function (err) {
            if (err) return res.status(400).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Property not found' });
            res.json({ message: 'Property deleted successfully' });
        });
    });
});

app.post('/api/seed', (req, res) => {
    const defaultData = [
        { title: 'Təcili satılır! 3 otaqlı menzil, Nərimanov', transactionType: 'satish', category: 'menzil', location: 'bakı', price: 155000, rooms: 3, area: 90, description: 'Tam təmirlidir...', images: JSON.stringify([]) },
        { title: 'Kirayə ofis, 28 May', transactionType: 'alish', category: 'ofis', location: 'bakı', price: 1200, rooms: 4, area: 120, description: 'Yaxşı təmir.', images: JSON.stringify([]) }
    ];
    const stmt = db.prepare(`INSERT INTO properties (title, transactionType, category, location, price, rooms, area, description, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    defaultData.forEach(prop => {
        stmt.run(prop.title, prop.transactionType, prop.category, prop.location, prop.price, prop.rooms, prop.area, prop.description, prop.images);
    });
    stmt.finalize();
    res.json({ message: 'Database seeded' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
