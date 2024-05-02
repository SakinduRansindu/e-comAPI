const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticateUser, roleFilter(['Seller']), orderController.getSellerOrdersList);
router.post('/setState/:id', authenticateUser, roleFilter(['Seller']), orderController.setOrderState);

router.get('/customer', authenticateUser, roleFilter(['User']), orderController.getCustomerOrdersList);

module.exports = router;