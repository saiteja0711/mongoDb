const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const forgotPasswordRequests= sequelize.define('forgotpasswordrequests',{
  id: {
    type : Sequelize.UUID,
    allowNull : false,
    primaryKey : true
  },
  
 isactive:{
    type:Sequelize.BOOLEAN
    
  },
});

module.exports = forgotPasswordRequests;