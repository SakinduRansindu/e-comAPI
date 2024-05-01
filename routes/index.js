// this is the routes/index.js file

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');

router.get('/lol', (req, res) => {
    res.send('lol');
});

// router.get('/protected', authenticateUser ,(req, res) => {
//     res.send('protected');
// });

router.get('/protected', authenticateUser, roleFilter(["User"]) ,(req, res) => {
    res.send('protected');
});

router.use('/auth', authRoutes);



module.exports = router;