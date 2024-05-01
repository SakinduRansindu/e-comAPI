const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

// Define the User model
const Seller = sequelize.define('Seller', {
    SId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uname: DataTypes.STRING,
    DisplayName: DataTypes.STRING,
    Email: DataTypes.STRING,
    HashedPassword: DataTypes.STRING,
    Bank_Acc_No: DataTypes.STRING,
    Phone_No: DataTypes.STRING,
    ProfilePictureLink: DataTypes.STRING
  });
return Seller;
}
  