const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');



let clientDB='mongodb://127.0.0.1:27017/client';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn5=  mongoose.createConnection(clientDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db5 = conn5

db5.on("error", console.error.bind(console, "connection error: "));
db5.once("open", function () {
  console.log(colors.cyan(colors.bold("ClientDB"))+" Connected to MongoDB through mongoose successfully");
});


const ClientSchema = new Schema({


username:{
    type:String,
    maxlength:90,
    trim:true,
    unique:true,
    required:true
    
  },

phone:{
  type:Number,
  trim:true,
  maxlength:13
},

idcard:{
  type:String,
  trim:true,
  maxlength:50,
},

postcode:{
  type:String,
  trim:true,
  maxlength:50
},


role:{
  type:String,
  default:"owner",
  required:true,
  trim:true,
  lowercase:true

},

location:[],


status:{
  type:Boolean,
  default:true,
  required:true
},


});



const Client = db5.model('Client', ClientSchema);

module.exports= Client;