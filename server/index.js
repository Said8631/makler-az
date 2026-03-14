require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('./models/User');
const Property = require('./models/Property');
const Favorite = require('./models/Favorite');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'makler_secret_key_123';
const USER_SECRET_KEY = process.env.USER_SECRET_KEY || 'makler_user_secret_123';

// Middleware
app.use(cors());

// Body parsers only for non-multipart requests
app.use((req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
        // Skip body parsing for file uploads - multer will handle it
        return next();
    }
    express.json()(req, res, (err) => {
        if (err) return next(err);
        express.urlencoded({ extended: true })(req, res, next);
    });
});

// MongoDB Connection
let isConnected = false;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/makler_az';

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};
connectDB();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer setup with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'makler_az',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const upload = multer({ storage });

// JWT Middlewares
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

const authUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, USER_SECRET_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Yetkisiz giriş' });
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ message: 'Token tapılmadı' });
    }
};

// Admin Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'Feqan' && password === 'Feqan1234F') {
        const token = jwt.sign({ admin: true }, SECRET_KEY, { expiresIn: '1d' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ success: false, message: 'İstifadəçi adı və ya şifrə yalnışdır' });
});

// USER AUTH ENDPOINTS
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ success: false, message: 'Məlumatları tam doldurun' });

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Bu istifadəçi adı artıq mövcuddur' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        
        res.json({ success: true, message: 'Qeydiyyat uğurla tamamlandı' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server xətası' });
    }
});

app.post('/api/user/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ success: false, message: 'İstifadəçi tapılmadı' });

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const token = jwt.sign({ id: user._id, username: user.username }, USER_SECRET_KEY, { expiresIn: '7d' });
            res.json({ success: true, token, username: user.username });
        } else {
            res.status(401).json({ success: false, message: 'Şifrə yalnışdır' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server xətası' });
    }
});

// API Routes for Properties
app.get('/api/properties', async (req, res) => {
    try {
        let filter = {};

        if (req.query.transactionType) filter.transactionType = req.query.transactionType;
        if (req.query.category) filter.category = req.query.category;
        if (req.query.location) filter.location = req.query.location;
        if (req.query.metro) filter.metro = req.query.metro;
        
        if (req.query.priceMin || req.query.priceMax) {
            filter.price = {};
            if (req.query.priceMin) filter.price.$gte = Number(req.query.priceMin);
            if (req.query.priceMax) filter.price.$lte = Number(req.query.priceMax);
        }

        if (req.query.searchQuery) {
            const regex = new RegExp(req.query.searchQuery, 'i');
            filter.$or = [
                { title: regex },
                { location: regex },
                { description: regex }
            ];
        }

        const properties = await Property.find(filter).sort({ createdAt: -1 });
        res.json({ properties });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/properties/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ error: 'Property not found' });
        res.json({ property });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/properties', authAdmin, upload.array('images', 15), async (req, res) => {
    try {
        const { title, transactionType, category, location, price, rooms, area, description, metro } = req.body;
        
        if (!title || !price || !location) {
            return res.status(400).json({ error: 'Başlıq, qiymət və yerləşmə mütləqdir' });
        }

        // Cloudinary returns file.path as the URL
        const imagePaths = req.files ? req.files.map(file => file.path) : [];
        
        const newProperty = new Property({
            title, 
            transactionType, 
            category, 
            location, 
            price: Number(price), 
            rooms: rooms ? Number(rooms) : undefined, 
            area: area ? Number(area) : undefined, 
            description, 
            metro, 
            images: imagePaths
        });
        
        await newProperty.save();
        res.status(201).json({ message: 'Property created successfully', id: newProperty._id, property: newProperty });
    } catch (err) {
        console.error('Property creation error:', err);
        res.status(400).json({ error: err.message || 'Elan yaradılarkən xəta baş verdi' });
    }
});

app.put('/api/properties/:id', authAdmin, upload.array('images', 15), async (req, res) => {
    try {
        const { title, transactionType, category, location, price, rooms, area, description, metro } = req.body;
        
        let updateData = {
            title, 
            transactionType, 
            category, 
            location, 
            price: price ? Number(price) : undefined, 
            rooms: rooms ? Number(rooms) : undefined, 
            area: area ? Number(area) : undefined, 
            description, 
            metro
        };
        
        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => file.path);
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedProperty) return res.status(404).json({ error: 'Property not found' });
        
        res.json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (err) {
        console.error('Property update error:', err);
        res.status(400).json({ error: err.message || 'Elan yenilənərkən xəta baş verdi' });
    }
});

app.delete('/api/properties/:id', authAdmin, async (req, res) => {
    try {
        const deletedProperty = await Property.findByIdAndDelete(req.params.id);
        if (!deletedProperty) return res.status(404).json({ error: 'Property not found' });
        
        // Note: For a complete solution, we would also delete the images from Cloudinary here
        // using cloudinary.uploader.destroy(). Removing from DB for now.

        // Remove from favorites as well
        await Favorite.deleteMany({ property_id: req.params.id });

        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// FAVORITES API
app.post('/api/user/favorites', authUser, async (req, res) => {
    try {
        const { property_id } = req.body;
        const user_id = req.user.id;
        
        const newFavorite = new Favorite({ user_id, property_id });
        await newFavorite.save();
        
        res.json({ success: true, message: 'Added to favorites' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Already in favorites' });
        }
        res.status(500).json({ success: false, message: 'Server error adding favorite' });
    }
});

app.get('/api/user/favorites', authUser, async (req, res) => {
    try {
        const user_id = req.user.id;
        const favorites = await Favorite.find({ user_id }).populate('property_id').sort({ createdAt: -1 });
        
        // Map to return just the properties based on how frontend expects it
        const properties = favorites.map(f => f.property_id).filter(p => p !== null);
        
        res.json({ properties });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/user/favorites/:property_id', authUser, async (req, res) => {
    try {
        const user_id = req.user.id;
        const property_id = req.params.property_id;
        
        await Favorite.findOneAndDelete({ user_id, property_id });
        
        res.json({ success: true, message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error removing favorite' });
    }
});

// Check if a specific property is favorited by the user
app.get('/api/user/favorites/:property_id/check', authUser, async (req, res) => {
    try {
        const user_id = req.user.id;
        const property_id = req.params.property_id;
        
        const favorite = await Favorite.findOne({ user_id, property_id });
        
        res.json({ isFavorite: !!favorite });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Default seed data
app.post('/api/seed', async (req, res) => {
    try {
        const defaultData = [
            { title: 'Təcili satılır! 3 otaqlı menzil, Nərimanov', transactionType: 'satish', category: 'menzil', location: 'bakı', price: 155000, rooms: 3, area: 90, description: 'Tam təmirlidir...', images: [] },
            { title: 'Kirayə ofis, 28 May', transactionType: 'alish', category: 'ofis', location: 'bakı', price: 1200, rooms: 4, area: 120, description: 'Yaxşı təmir.', images: [] }
        ];
        
        await Property.insertMany(defaultData);
        res.json({ message: 'Database seeded' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for Vercel
