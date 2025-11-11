const mongoose = require('mongoose');

// Use a proper Schema so Mongoose validations and defaults behave as expected.
const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['developer', 'manager', 'designer', 'qa', 'hr']
    },
    department: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        // Use the function reference so the default is set at document creation time
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;