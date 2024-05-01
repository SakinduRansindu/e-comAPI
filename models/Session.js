const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{
const session = sequelize.define("Session", {
    sid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: DataTypes.STRING,
    role: DataTypes.STRING,
    expires: DataTypes.DATE,
    jwt: DataTypes.TEXT,
  });
  
  
return session;
}
  