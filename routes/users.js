const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/go')
mongoose.connect('mongodb+srv://ali:Guddu@1234@cluster0.0jdco.mongodb.net/sell_app?retryWrites=true&w=majority',{ useNewUrlParser: true ,useUnifiedTopology: true })
const plm = require('passport-local-mongoose')

const userSchema = mongoose.Schema({
  name:String,
  username:String,
  password:String,
  email:String,
  cars:[{ type:mongoose.Schema.Types.ObjectId,
    ref: 'car'}],
  profileimage:{
    type: String,
    default: '../images/uploads/jhabra.png'
  } 
})

userSchema.plugin(plm);

module.exports = mongoose.model('user' , userSchema)