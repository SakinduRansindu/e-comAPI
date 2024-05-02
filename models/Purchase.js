const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const Purchase = sequelize.define('Purchase', {
        PurchaseId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        UId: DataTypes.INTEGER,
        SId: DataTypes.INTEGER,
        ProductId: DataTypes.INTEGER,
        Units: DataTypes.INTEGER,
        PurchaseDateTime: DataTypes.DATE,
        TotalPrice: DataTypes.FLOAT,
        state: DataTypes.STRING
      });

return Purchase;
}
  