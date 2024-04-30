const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const ProductImgs = sequelize.define('ProductImgs', {
        imgId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        imgUrl: DataTypes.STRING
      });
      

return ProductImgs;
}
  