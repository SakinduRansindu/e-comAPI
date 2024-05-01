const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  // Define the Seller model
  const Seller = sequelize.define('Seller', {
    SId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uname: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Username is required'
      },
      unique: {
        args: true,
        msg: 'Username already exists'
      },
    },
    DisplayName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Display name is required'
      },
      validate: {
        notEmpty: {
          msg: 'Display name is required'
        }
      }
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already exists'
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    HashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Bank_Acc_No: DataTypes.STRING,
    Phone_No: DataTypes.STRING,
    ProfilePictureLink: DataTypes.STRING
  });

  return Seller;
};
