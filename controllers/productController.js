// /addProduct
// params: Category,AvailableUnits,DisplayName,Description,UnitPrice,Discount,DiscountEndDate,imgs

// /updateProduct
// params: productId, Category,AvailableUnits,DisplayName,Description,UnitPrice,Discount,DiscountEndDate,imgs[]
// multipart/form-data, array of imgs

// /deleteProduct
// params: productId

// /getProducts
// params: catagory? , sellerName? / SId? , productName?

// /getProductDetails
// params: productId

const Product = require('../models').Product;
const ProductImgs = require('../models').ProductImgs;
const Seller = require('../models').Seller;

async function addProduct(req, res) {
    const { Category, AvailableUnits, DisplayName, Description, UnitPrice, Discount, DiscountEndDate } = req.body;
     
    const SId  = req.user.SId;

    if ( !Category || !AvailableUnits || !DisplayName || !UnitPrice) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const product = await Product.create({
            SId,
            Category,
            AvailableUnits,
            DisplayName,
            Description,
            UnitPrice,
            Discount,
            DiscountEndDate
        });

        if (req.files && req.files.length > 0) {
            const imgs = req.files.map(file => ({ imgUrl: file.filename }));
            await ProductImgs.bulkCreate(imgs.map(img => ({ ...img, ProductId: product.id })));
        }
        return res.status(200).json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}

async function updateProduct(req, res) {
    const { productId, Category, AvailableUnits, DisplayName, Description, UnitPrice, Discount, DiscountEndDate } = req.body;
    
    // find the product by productId 
    const productExists = await Product.findOne({ where: { ProductId: productId } });

    if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { SId } = productExists;
    if (SId != req.user.SId) {
        return res.status(401).json({ message: 'Unauthorized no logged in seller\'s product' });
    }

    try {
        const product = await Product.update({
            Category,
            AvailableUnits,
            DisplayName,
            Description,
            UnitPrice,
            Discount,
            DiscountEndDate
        }, {
            where: {
                ProductId: productId,
                SId : SId
            }
        });
        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


async function deleteProduct(req, res) {
    const { productId } = req.body;
    const productExists = await Product.findOne({ where: { ProductId: productId } });

    if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const { SId } = productExists;
    if (SId != req.user.SId) {
        return res.status(401).json({ message: 'Unauthorized no logged in seller\'s product' });
    }

    try {
        const product = await Product.destroy({ where: { productId } });
        return res.status(200).json({ message: 'Product deleted successfully', product });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProducts(req, res) {
    const { category, sellerName, SId, productName } = req.body;
    try {
      
        // products can be fetched either by category, seller name or product name or all 
        let products = [];
        let whereClause = {};

        if (category) {
            whereClause.Category = category;
        }

        if (sellerName) {
            whereClause.DisplayName = {
            [Op.like]: `%${sellerName}%`
            };
        }

        if (SId) {
            whereClause.SId = SId;
        }

        if (productName) {
            whereClause.DisplayName = {
            [Op.like]: `%${productName}%`
            };
        }

        if (Object.keys(whereClause).length > 0) {
            products = await Product.findAll({
            where: whereClause,
            include: [{
                model: Seller,
                attributes: {
                    exclude: ['HashedPassword', 'Email', 'Bank_Acc_No', 'Phone_No']
                }
            }]
            });
        } else {
            products = await Product.findAll(
            {
                include: [{
                    model: Seller,
                    attributes: {
                        exclude: ['HashedPassword', 'Email', 'Bank_Acc_No', 'Phone_No']
                    }
                }]
            }
            );
        }

        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error getting products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getProductDetails(req, res) {
    const { productId } = req.body;
    console.log(req.body)
    try {
        let product = await Product.findOne({
            where: {
                ProductId: productId
            },
            include: [{
                model: Seller,
                attributes: {
                    exclude: ['HashedPassword', 'Email', 'Bank_Acc_No', 'Phone_No']
                }
            }]
        });

        return res.status(200).json({ product });
    } catch (error) {
        console.error('Error getting product details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getProductDetails
};