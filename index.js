const express = require("express");
const app = express();

const db = require('./models')

const { User, Seller, Session, SellerSocialMediaLinks, Product, ProductImgs, Purchase } = db;

User.hasMany(Purchase, { foreignKey: 'UId' });
Purchase.belongsTo(User, { foreignKey: 'UId' });

Seller.hasMany(Product, { foreignKey: 'SId' });
Product.belongsTo(Seller, { foreignKey: 'SId' });

Product.hasMany(ProductImgs, { foreignKey: 'ProductId' });
ProductImgs.belongsTo(Product, { foreignKey: 'ProductId' });

Seller.hasMany(SellerSocialMediaLinks, { foreignKey: 'SId' });
SellerSocialMediaLinks.belongsTo(Seller, { foreignKey: 'SId' });



db.sequelize.sync().then((req)=>{
    app.listen(3001, ()=>{
        console.log("server running...");
    })
});

