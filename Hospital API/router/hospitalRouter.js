const express = require('express');
const Hospital = require('../models/Hospital');
const { ensureAuthenticated } = require('../utils/auth');

const router = express.Router();

// Get all hospitals
router.get('/', async (req, res) => {
  try {
    const list = await Hospital.find();
    res.json(list);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get by id
router.get('/:id', async (req, res) => {
  try {
    const h = await Hospital.findById(req.params.id);
    if (!h) return res.status(404).json({ message: 'Hospital not found' });
    res.json(h);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

// Create new hospital (protected)
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { name, city, totalBeds, availableBeds } = req.body;

    // Coerce numeric fields (clients sometimes send strings). Also tolerate
    // values with a leading ':' (e.g. ":200") from mis-typed Postman bodies.
    const parseNumber = (v) => {
      if (v === undefined || v === null || v === '') return undefined;
      if (typeof v === 'string') {
        const cleaned = v.trim().replace(/^:+/, '').replace(/,/g, '');
        const n = Number(cleaned);
        return Number.isNaN(n) ? undefined : n;
      }
      const n = Number(v);
      return Number.isNaN(n) ? undefined : n;
    };

    const payload = { name, city };
    const tb = parseNumber(totalBeds);
    const ab = parseNumber(availableBeds);
    if (tb !== undefined) payload.totalBeds = tb;
    if (ab !== undefined) payload.availableBeds = ab;

    const h = await Hospital.create(payload);
    res.status(201).json(h);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update hospital (protected)
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    // Coerce numeric fields similarly to POST
    const body = { ...req.body };
    if (body.totalBeds !== undefined) {
      const n = Number(String(body.totalBeds).trim().replace(/^:+/, '').replace(/,/g, ''));
      body.totalBeds = Number.isNaN(n) ? body.totalBeds : n;
    }
    if (body.availableBeds !== undefined) {
      const n = Number(String(body.availableBeds).trim().replace(/^:+/, '').replace(/,/g, ''));
      body.availableBeds = Number.isNaN(n) ? body.availableBeds : n;
    }

    const updated = await Hospital.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Hospital not found' });
    res.json(updated);
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(400).json({ message: 'Invalid id or payload' });
  }
});

// Delete hospital (protected)
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const removed = await Hospital.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    res.status(400).json({ message: 'Invalid id' });
  }
});

module.exports = router;
