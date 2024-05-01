const express = require("express");
const app = express();
const createDatabaseIfNotExists = require('./utils/createDatabaseIfNotExists');

const db = require('./models')
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const { User, Seller, Session, SellerSocialMediaLinks, Product, ProductImgs, Purchase } = db;

User.hasMany(Purchase, { foreignKey: 'UId' });
Purchase.belongsTo(User, { foreignKey: 'UId' });

Seller.hasMany(Product, { foreignKey: 'SId' });
Product.belongsTo(Seller, { foreignKey: 'SId' });

Product.hasMany(ProductImgs, { foreignKey: 'ProductId' });
ProductImgs.belongsTo(Product, { foreignKey: 'ProductId' });

Seller.hasMany(SellerSocialMediaLinks, { foreignKey: 'SId' });
SellerSocialMediaLinks.belongsTo(Seller, { foreignKey: 'SId' });

Session.hasMany(User, { foreignKey: 'uname' });
User.belongsTo(Session, { foreignKey: 'uname' });

Session.hasMany(Seller, { foreignKey: 'uname' });
Seller.belongsTo(Session, { foreignKey: 'uname' });

createDatabaseIfNotExists().then(() => {
    db.sequelize.sync().then(() => {
        app.listen(3001, () => {
        console.log('Server running on http://localhost:3001');
        });
    });
    }).catch((error) => {
    console.error('Error creating database:', error);
    throw error;
});
