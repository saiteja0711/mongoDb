const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadedFilesSchema = new Schema({
    fileURL:{
      type:String,
      default:false
    },
  userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }
});

module.exports = mongoose.model('downloadedFiles',downloadedFilesSchema);

