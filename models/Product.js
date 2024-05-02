const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const Product = sequelize.define('Product', {
        ProductId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        SId: DataTypes.INTEGER,
        Category: {
          type: DataTypes.STRING,
          allowNull: {
            args: false,
            msg: 'Please enter a category'
          }
        },
        AvailableUnits: {
          type: DataTypes.INTEGER,
          allowNull: {
            args: false,
            msg: 'Please enter available units'
          }
        },
        DisplayName: {
          type: DataTypes.STRING,
          allowNull: {
            args: false,
            msg: 'Please enter a display name'
          }
        },
        Description: {
          type: DataTypes.STRING,
          allowNull: true
        },
        UnitPrice: {
          type: DataTypes.FLOAT,
          allowNull: {
            args: false,
            msg: 'Please enter a unit price'
          }
        },
        Discount: DataTypes.FLOAT,
        DiscountEndDate: DataTypes.DATE,
        views: DataTypes.INTEGER

        // SId: DataTypes.INTEGER,
        // Category: DataTypes.STRING,
        // AvailableUnits: DataTypes.INTEGER,
        // DisplayName: DataTypes.STRING,
        // Description: DataTypes.STRING,
        // UnitPrice: DataTypes.FLOAT,
        // Discount: DataTypes.FLOAT,
        // DiscountEndDate: DataTypes.DATE,
        // views: DataTypes.INTEGER
      });

return Product;
}
  