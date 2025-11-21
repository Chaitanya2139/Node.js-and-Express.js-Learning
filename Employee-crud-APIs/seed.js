const mongoose = require('mongoose');
const Employee = require('./models/Employee');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employeeDB';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB:', MONGO_URI);

    // Delete existing documents (optional)
    await Employee.deleteMany({});
    console.log('Cleared Employee collection');

    const employees = [
      { name: 'Alice Johnson', email: 'alice.johnson@example.com', role: 'developer', department: 'Engineering', salary: 70000 },
      { name: 'Bob Smith', email: 'bob.smith@example.com', role: 'manager', department: 'Product', salary: 90000 },
      { name: 'Carol Lee', email: 'carol.lee@example.com', role: 'designer', department: 'Design', salary: 65000 }
    ];

    const created = await Employee.insertMany(employees);
    console.log('Inserted employees:', created.map(e => e.email));

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
