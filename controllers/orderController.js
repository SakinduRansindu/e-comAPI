// /getSellerOrdersList
// params: SId

// /setOrderState
// params: state

// /getCustomerOrdersList
// params: UId

// /getCustomerOrderState
// params: PurchaseId

const Purchase = require("../models").Purchase;
const Product = require("../models").Product;


async function getSellerOrdersList(req, res) {
    const SId  = req.user.SId;
    const purchases = await Purchase.findAll({ 
        include: [{ 
            model: Product, 
            where: { SId: SId } 
        }] 
    });
    if (!purchases) {
        return res.status(404).json({ message: 'No orders found' });
    }

    return res.status(200).json({ message: 'Orders found', purchases });
}

async function setOrderState(req, res) {
    const { state } = req.body;
    const PurchaseId = req.params.id;

    if (state !== 'pending' && state !== 'shipped' && state !== 'delivered' && state !== 'cancelled') {
        return res.status(400).json({ message: 'Invalid state only accepts pending, shipped, delivered, cancelled' });
    }

    const purchase = await Purchase.findByPk(PurchaseId, {
        include: [Product]
    });

    if (!purchase) {
        return res.status(404).json({ message: 'Order not found' });
    }

    let product = purchase.Product;

    if (product.SId !== req.user.SId) {
        return res.status(401).json({ message: 'Unauthorized: this order does not belong to you' });
    }
    
    try {
        await purchase.update({ state });
        return res.status(200).json({ message: 'Order state updated', purchase });
    } catch (error) {
        console.error('Error updating order state:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getCustomerOrdersList(req, res) {
    const UId = req.user.UId;
    const purchase = await Purchase.findAll({ where: { UId: UId } });
    if (!purchase) {
        return res.status(404).json({ message: 'No orders found' });
    }
    return res.status(200).json({ message: 'Orders found', purchase });
}

module.exports = {
    getSellerOrdersList,
    setOrderState,
    getCustomerOrdersList
};