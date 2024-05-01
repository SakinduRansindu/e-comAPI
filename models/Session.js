const { sequelize } = require(".");

module.exports = (sequelize,DataTypes)=>{

  //   const Session = sequelize.define('Session', {
  //   uname:{
  //     type: DataTypes.STRING,
  //     primaryKey: true,
  //     autoIncrement: false
  //   },
  //   jwt: DataTypes.STRING,
  //   role: DataTypes.STRING,
  //   expireDate: DataTypes.DATE
  // });

const session = sequelize.define("Session", {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    jwt: DataTypes.TEXT,
  });
  
  
return session;
}
  