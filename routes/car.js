const mongoose = require('mongoose');


const carSchema = mongoose.Schema({
  carname:String,
  sellerid: {
       type:mongoose.Schema.Types.ObjectId,
       ref: 'user'
  },
  carprice:String,
  contact:String,
  carimg:{
    type: String,
    required:true
  } 
})

module.exports = mongoose.model('car' , carSchema)