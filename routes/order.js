const express = require('express');
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', authenticateUser, roleFilter(['seller']), orderController.getSellerOrdersList);
router.post('/setState/:id', authenticateUser, roleFilter(['seller']), orderController.setOrderState);

router.get('/customer', authenticateUser, roleFilter(['customer']), orderController.getCustomerOrdersList);

module.exports = router;