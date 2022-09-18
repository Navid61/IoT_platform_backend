const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const colors = require('colors');

let  sceneDB='mongodb://127.0.0.1:27017/scene';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn11=  mongoose.createConnection(sceneDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db11 = conn11

db11.on("error", console.error.bind(console, "connection error: "));
db11.once("open", function () {
  console.log(colors.white(colors.bold("sceneDB"))+" Connected to MongoDB through mongoose successfully");
});



const SceneSchema = new Schema({


  service_id:{
    type:String,
    trim:true,
    required:true,
    maxlength:360,
    unique:true,
  },

  name:{
    type:String,
    required:true,
    trim:true,
    maxlength:300
  },

 scene:{
    type:Array,
    required:true
  },

  status:{
    default:true,
  }



});



const Scene = db11.model('Scene', SceneSchema);

module.exports= Scene;