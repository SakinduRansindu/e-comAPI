// this is the routes/index.js file

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const productRoutes = require('./product');
const purchaseRoutes = require('./purchase');
const orderRoutes = require('./order');

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
router.use('/product', productRoutes);
router.use('/purchase', purchaseRoutes);
router.use('/order', orderRoutes);


module.exports = router;