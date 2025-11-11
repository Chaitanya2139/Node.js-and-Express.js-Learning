const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const mongoose = require('mongoose');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
router.use(requestLogger);

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Welcome to Hotel APIs!' });
});

router.get('/hotels', async (req, res) => {
    try {
        let query = {};
        
        if (req.query.rating) {
            query.rating = parseInt(req.query.rating);
        }
        if (req.query.location) {
            query.location = new RegExp(req.query.location, 'i'); 
        }
        
        const hotels = await Hotel.find(query);
        res.status(200).json(hotels);
    } catch (error) {
        console.error('GET /hotels error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/hotels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid hotel id' });
        }
        
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        console.error(`GET /hotels/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/hotels', async (req, res) => {
    try {
        const { name, location, rating, pricePerNight } = req.body;

        if (!name || !location || rating == null || pricePerNight == null) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, location, rating, pricePerNight' 
            });
        }

        if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
            return res.status(400).json({ 
                error: 'Rating must be an integer between 1 and 5' 
            });
        }

        const existing = await Hotel.findOne({ name });
        if (existing) {
            return res.status(409).json({ error: 'Hotel with this name already exists' });
        }

        const newHotel = new Hotel({
            name,
            location,
            rating,
            pricePerNight
        });

        await newHotel.save();
        res.status(201).json(newHotel);
    } catch (error) {
        console.error('POST /hotels error:', error);
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.put('/hotels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid hotel id' });
        }

        if (req.body.rating !== undefined) {
            const rating = req.body.rating;
            if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
                return res.status(400).json({ 
                    error: 'Rating must be an integer between 1 and 5' 
                });
            }
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedHotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        
        res.status(200).json(updatedHotel);
    } catch (error) {
        console.error(`PUT /hotels/${req.params.id} error:`, error);
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/hotels/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid hotel id' });
        }
        
        const deletedHotel = await Hotel.findByIdAndDelete(id);
        if (!deletedHotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error(`DELETE /hotels/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;