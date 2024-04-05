const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
  isActive:{
      type:Boolean,
      default:false
    },
  userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }
});

module.exports = mongoose.model('forgotPasswordRequests',forgotPasswordSchema);





