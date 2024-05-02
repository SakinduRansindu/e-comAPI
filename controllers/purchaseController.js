const Purchase = require("../models").Purchase;
const Product = require("../models").Product;

async function makePurchase(req, res) {
    const { ProductId, Units } = req.body;
    const UId = req.user.UId;
   
    if (!ProductId) {
        return res.status(400).json({ message: 'Please provide product' });
    }

    const product = await Product.findByPk(ProductId);

    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    if (product.AvailableUnits < Units) {
        return res.status(400).json({ message: 'Not enough units available' });
    }

    if (Units < 1) {
        return res.status(400).json({ message: 'Invalid units' });
    }

    const PurchaseDateTime = new Date();
    const state = 'pending';
    const discount = product.DiscountEndDate > PurchaseDateTime ? product.Discount : 0;

    const TotalPrice = Units * product.UnitPrice * ((100 - discount)/100);
    
    try {
        const purchase = await Purchase.create({
            UId,
            ProductId,
            Units,
            PurchaseDateTime,
            TotalPrice,
            state
        });

        await product.update({ AvailableUnits: product.AvailableUnits - Units });

        return res.status(200).json({ message: 'Purchase successful', purchase });
    } catch (error) {
        console.error('Error making purchase:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

module.exports = {
    makePurchase
};