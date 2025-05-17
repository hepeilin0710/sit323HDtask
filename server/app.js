const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas connection config
const uri = process.env.MONGODB_URI || "mongodb+srv://hepeilin0710:JrRf9Fay1G5jaG76@cluster0.cakjqda.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'hpl',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: uri,
        dbName: 'checkin-system'
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Database connection
mongoose.connect(uri, {
    dbName: 'checkin-system',
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Atlas connected successfully'))
.catch(err => console.error('MongoDB Atlas connection error:', err));

// Authentication middleware
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/goals', require('./routes/goals'));

// Page routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (req.session.userId) {
        return res.redirect('/dashboard');
    }
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/goals', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'goals.html'));
});

app.get('/checkin', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkin.html'));
});

app.get('/report', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'report.html'));
});

app.get('/settings', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});

app.get('/leaderboard', authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});