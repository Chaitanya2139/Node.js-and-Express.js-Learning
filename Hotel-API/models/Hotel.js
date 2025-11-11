const mongoose = require('mongoose');
const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true 
    },
    location: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: 'Rating must be an integer between 1 and 5'
        }
    },
    pricePerNight: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;