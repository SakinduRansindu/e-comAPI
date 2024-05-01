module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    UId: {
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
        msg: 'Username already exists' // Custom error message for unique constraint
      }
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'First name is required'
      },
      validate: {
        notEmpty: {
          msg: 'First name is required'
        }
      }
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Last name is required'
      },
      validate: {
        notEmpty: {
          msg: 'Last name is required'
        }
      }
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: {
        args: false,
        msg: 'Email is required'
      },
      validate : {
        isEmail: {
          msg: 'Invalid email format'
        }
      },
      unique: {
        args: true,
        msg: 'Email already exists'
      },
    },
    HashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Account_No: DataTypes.STRING,
    Card_CVC: DataTypes.STRING,
    Card_Exp: DataTypes.STRING,
    Phone_No: DataTypes.STRING,
    ProfilePictureLink: DataTypes.STRING
  });

  return User;
};
