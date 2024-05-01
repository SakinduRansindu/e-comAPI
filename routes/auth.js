const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// both user and seller login
router.get('/test', (req, res) => {
    res.send('auth test');
    }    
);

router.post('/login', authController.login);

router.post('/userReg', authController.registerUser);

router.post('/sellerReg', authController.registerSeller);

module.exports = router;
