const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

  const User = sequelize.define('User', {
    UId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uname: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Email: DataTypes.STRING,
    HashedPassword: DataTypes.STRING,
    Account_No: DataTypes.STRING,
    Card_CVC: DataTypes.STRING,
    Card_Exp: DataTypes.STRING,
    Phone_No: DataTypes.STRING,
    ProfilePictureLink: DataTypes.STRING
  });
return User;
}
  

  // User.hasMany(Purchase, { foreignKey: 'UId' });
  // Purchase.belongsTo(User, { foreignKey: 'UId' });
  
  // Seller.hasMany(Product, { foreignKey: 'SId' });
  // Product.belongsTo(Seller, { foreignKey: 'SId' });
  
  // Product.hasMany(ProductImgs, { foreignKey: 'ProductId' });
  // ProductImgs.belongsTo(Product, { foreignKey: 'ProductId' });
  
  // Seller.hasMany(SellerSocialMediaLinks, { foreignKey: 'SId' });
  // SellerSocialMediaLinks.belongsTo(Seller, { foreignKey: 'SId' });
  

