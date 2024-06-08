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
          type: DataTypes.STRING(1000),
          allowNull: true
        },
        UnitPrice: {
          type: DataTypes.FLOAT,
          allowNull: {
            args: false,
            msg: 'Please enter a unit price'
          }
        },
        Discount: {
          type: DataTypes.FLOAT,
          allowNull: {
            args: false,
            msg: 'Please enter a discount'
          },
          validate: {
            min: 0,
            max: 100
          }
        },
        DiscountEndDate: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isAfter: new Date().toISOString().split('T')[0]
          }
        },  
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
  