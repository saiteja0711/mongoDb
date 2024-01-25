const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Users = sequelize.define('users',{
  id: {
    type : Sequelize.INTEGER,
    autoIncrement: true,
    allowNull : false,
    primaryKey : true
  },
 name : Sequelize.STRING,
 email: {
    type: Sequelize.STRING,
    unique: true
  },
 password : Sequelize.STRING,
 ispremium:{
  type:Sequelize.BOOLEAN,
  defaultValue:false
}

  
  
  
});

module.exports = Users;