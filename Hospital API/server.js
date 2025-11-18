require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const authRouter = require('./router/authRouter');
const hospitalRouter = require('./router/hospitalRouter');
const User = require('./models/User');
const { ensureAuthenticated } = require('./utils/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Session + Passport setup (passport-local)
app.use(session({
  secret: process.env.SESSION_SECRET || 'devsessionsecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure local strategy: authenticate by username and password
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Incorrect username' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Incorrect password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id);
    done(null, u);
  } catch (err) {
    done(err);
  }
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hospitalDB';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.get('/', (req, res) => res.send('Welcome to Hospital APIs'));

// Debug: whoami - returns current session user when logged in via passport-local
app.get('/whoami', ensureAuthenticated, (req, res) => {
  res.json({ user: req.user });
});

// Mount routers. We expose both API-prefixed and top-level endpoints
// so the project matches the homework endpoints (e.g. POST /register, POST /login,
// GET /hospitals, etc.) as well as /api/* variants.
app.use('/api/auth', authRouter);
app.use('/api/hospitals', hospitalRouter);

// Top-level endpoints to match assignment
app.use('/', authRouter);
app.use('/hospitals', hospitalRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Hospital API running on http://localhost:${PORT}`));
