const router = require('express').Router();
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');

const { addProduct, updateProduct, deleteProduct, getProductDetails ,getProducts} = require('../controllers/productController');


router.post('/add', authenticateUser, roleFilter(['Seller']), addProduct);
router.post('/update', authenticateUser, roleFilter(['Seller']), updateProduct);
router.post('/delete', authenticateUser, roleFilter(['Seller']), deleteProduct);
router.get('/getProductDetails', getProductDetails);
router.get('/getProducts', getProducts);

module.exports = router;
