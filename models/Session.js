const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

    const Session = sequelize.define('Session', {
    uname: DataTypes.STRING,
    jwt: DataTypes.STRING,
    role: DataTypes.STRING,
    expireDate: DataTypes.DATE
  });
  
return Session;
}
  