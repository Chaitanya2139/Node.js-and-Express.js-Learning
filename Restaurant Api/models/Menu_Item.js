const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
	restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true },
	isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
