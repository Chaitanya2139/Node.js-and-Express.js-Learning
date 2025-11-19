const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/Menu_Item');
const auth = require('./authMiddleware');

const router = express.Router();

// Get all restaurants
router.get('/restaurants', async (req, res) => {
	try {
		const restaurants = await Restaurant.find();
		res.json(restaurants);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Get restaurant by ID
router.get('/restaurants/:id', async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
		res.json(restaurant);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Add a new restaurant (JWT required)
router.post('/restaurants', auth, async (req, res) => {
	try {
		const { name, city, address, cuisine, rating } = req.body;
		const restaurant = await Restaurant.create({ name, city, address, cuisine, rating });
		res.status(201).json(restaurant);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Update restaurant (JWT required)
router.put('/restaurants/:id', auth, async (req, res) => {
	try {
		const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ message: 'Restaurant not found' });
		res.json(updated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Delete restaurant (JWT required)
router.delete('/restaurants/:id', auth, async (req, res) => {
	try {
		const removed = await Restaurant.findByIdAndDelete(req.params.id);
		if (!removed) return res.status(404).json({ message: 'Restaurant not found' });
		// Remove related menu items
		await MenuItem.deleteMany({ restaurantId: req.params.id });
		res.json({ message: 'Restaurant deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Get menu for a restaurant
router.get('/restaurants/:id/menu', async (req, res) => {
	try {
		const items = await MenuItem.find({ restaurantId: req.params.id });
		res.json(items);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Add menu item to a restaurant (JWT required)
router.post('/restaurants/:id/menu', auth, async (req, res) => {
	try {
		const { name, price, isAvailable } = req.body;
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

		const item = await MenuItem.create({ restaurantId: req.params.id, name, price, isAvailable });
		res.status(201).json(item);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Update menu item (JWT required)
router.put('/menu/:id', auth, async (req, res) => {
	try {
		const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!updated) return res.status(404).json({ message: 'Menu item not found' });
		res.json(updated);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Delete menu item (JWT required)
router.delete('/menu/:id', auth, async (req, res) => {
	try {
		const removed = await MenuItem.findByIdAndDelete(req.params.id);
		if (!removed) return res.status(404).json({ message: 'Menu item not found' });
		res.json({ message: 'Menu item deleted' });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
