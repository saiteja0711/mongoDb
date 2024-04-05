const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  expenseAmount : {
    type:String,
    required:true
  },
 expenseDescription : {
    type:String,
    required:true
  },
  expenseCategory:{
    type:String,
    required:true
  },
  userId:{
    type:Schema.Types.ObjectId,
    required:true,
    ref:'Users'
}

});

module.exports = mongoose.model('Expenses',expenseSchema);