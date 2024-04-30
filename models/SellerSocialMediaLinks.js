const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const SellerSocialMediaLinks = sequelize.define('SellerSocialMediaLinks', {
        linkId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        Social_media_link: DataTypes.STRING
      });
      
return SellerSocialMediaLinks;
}
  