const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');
const authRouter = require('./router/authRouter');
const restaurantRouter = require('./router/restaurantRouter');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Routes (mounted at root so routes are available at `/register`, `/login`, `/restaurants`, ...)
app.use(authRouter);
app.use(restaurantRouter);

// Start
const start = async () => {
	await connectDB();
	app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
};

start();
