
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const colors = require("colors")

// const sigmaBoardDB = mongodb.sigmaBoardDB

var sigmaBoardDB='mongodb://127.0.0.1:27017/sigmaboard';

try {
  var conn99 = mongoose.createConnection(sigmaBoardDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db99 = conn99

db99.on("error", console.error.bind(console, "connection error: "))
db99.once("open", function () {
  console.log(
    colors.cyan(colors.bold("sigmaBoardDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

db99.on('disconnected', function() {
  console.log("Disconnected from DB!" ,'serviceDB');
  // You might decide to try and reconnect here
});



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





const Account =  db99.model('Account', UserAccountSchema);
// Top-level error is a ValidationError, **not** a ValidatorError



module.exports= Account;