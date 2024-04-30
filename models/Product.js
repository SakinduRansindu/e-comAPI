const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const Product = sequelize.define('Product', {
        ProductId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        SId: DataTypes.INTEGER,
        Category: DataTypes.STRING,
        AvailableUnits: DataTypes.INTEGER,
        DisplayName: DataTypes.STRING,
        Description: DataTypes.STRING,
        UnitPrice: DataTypes.FLOAT,
        Discount: DataTypes.FLOAT,
        DiscountEndDate: DataTypes.DATE,
        views: DataTypes.INTEGER
      });
return Product;
}
  