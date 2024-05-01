// this is the routes/index.js file

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

router.get('/lol', (req, res) => {
    res.send('lol');
});

router.use('/auth', authRoutes);



module.exports = router;