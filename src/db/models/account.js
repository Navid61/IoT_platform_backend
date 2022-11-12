
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const mongodb = require("../../db/config/mongodb")
const sigmaBoardDB = mongodb.sigmaBoardDB




const UserAccountSchema = new Schema({

 
  client:{
    type:String,
    trim:true,
    uppercase:true,
    maxLength:500,
    default:'SIGMABOARD'
  },

  username: {
    type: String,
    required: true,
    lowercase:true,
    trim:true,
    unique:true,
    maxLength:300,
   
      
  },
  password: {
    type: String,
    required: true,
    maxLength:255
  },
 

  date:{
    type:Date,
    required:true,
    default:new Date().toLocaleString()
  },
 
  verification:{
    type:Boolean,
    required:true,
    default:false,
  },
  role:{
    type:String,
    default:"user",
    required:true,
    lowercase:true,
    trim:true,
    maxLength:50,
    minLength:3,
  },
  site:[],


});


UserAccountSchema.pre(
    'save',
    async function(next) {
      const user = this;
      
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;

  
    
  
     next();
    }
  );


 



  UserAccountSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

  UserAccountSchema.methods.isActive =async function() {
    const user = this;
   return this.verification;
  }





const Account =  mongoose.model('Account', UserAccountSchema);
// Top-level error is a ValidationError, **not** a ValidatorError



module.exports= Account;