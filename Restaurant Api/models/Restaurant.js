const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
	name: { type: String, required: true },
	city: { type: String },
	address: { type: String },
	cuisine: { type: String },
	rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
