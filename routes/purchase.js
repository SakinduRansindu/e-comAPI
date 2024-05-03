const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');
const { makePurchase } = require('../controllers/purchaseController');

const router = express.Router();

// make a new purchase
router.post('/', authenticateUser, roleFilter(['customer']), makePurchase);

module.exports = router;