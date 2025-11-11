const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
router.use(requestLogger);

router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('GET /employees error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (error) {
        console.error(`GET /employees/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, email, role, department, salary } = req.body;

        // Basic payload validation to give clearer feedback to clients.
        if (!name || !email || !role || !department || salary == null) {
            return res.status(400).json({ error: 'Missing required fields: name, email, role, department, salary' });
        }

        const newEmployee = new Employee({
            name, email, role, department, salary
        });
        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        console.error('POST /employees error:', error);
        // If it's a Mongoose validation or duplicate key error, surface that to the client.
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        console.error(`PUT /employees/${req.params.id} error:`, error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(`DELETE /employees/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;