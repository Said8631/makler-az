const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    transactionType: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rooms: { type: Number },
    area: { type: Number },
    description: { type: String },
    metro: { type: String },
    images: [{ type: String }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Property', propertySchema);
