const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const colors = require('colors');

let  sceneDB='mongodb://127.0.0.1:27017/scene';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn14=  mongoose.createConnection(sceneDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db14 = conn14

db14.on("error", console.error.bind(console, "connection error: "));
db14.once("open", function () {
  console.log(colors.white(colors.bold("sceneDB"))+" Connected to MongoDB through mongoose successfully");
});



const SceneInfoSchema = new Schema({




  service_id:{
    type:String,
    trim:true,
    default:'99999',
    required:true,
    maxLength:360,
   
  },

name:{
    type:String,
    default:'none',
    required:true,
    trim:true,
    maxLength:300
  },

  scenes:{
    type:Array,
    required:true
  },


status:{
  type:Boolean,
  default:true,
  required:true
}

 





});



const Scene = db14.model('Scene', SceneInfoSchema);

module.exports= Scene;