const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    Fullname:{
        type:String,
        required:true,
    },
    EmailAddress:{
        type:String,
        required:true,
        unique:true,
    },
    PhoneNumber:{
        type:Number,
        required:true,
    },
    Password:{
        type:String,
        required:true,
    }
},{timestamps:true});

module.exports = mongoose.model('user',userSchema);
