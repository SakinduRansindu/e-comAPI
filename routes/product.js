const router = require('express').Router();
const authenticateUser = require('../middleware/authenticateUser');
const roleFilter = require('../middleware/roleFilter');
const upload = require('../utils/multerConfig');

const { addProduct, updateProduct, deleteProduct, getProductDetails ,getProducts} = require('../controllers/productController');


router.post('/add', authenticateUser, roleFilter(['seller']), upload.array('imgs', 5) ,addProduct);
router.post('/update', authenticateUser, roleFilter(['seller']), updateProduct);
router.post('/delete', authenticateUser, roleFilter(['seller']), deleteProduct);
router.get('/getProductDetails', getProductDetails);
router.get('/getProducts', getProducts);

module.exports = router;
