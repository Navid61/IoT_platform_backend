const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const colors = require('colors');

let deviceDB='mongodb://127.0.0.1:27017/device';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn7=  mongoose.createConnection(deviceDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db7 = conn7

db7.on("error", console.error.bind(console, "connection error: "));
db7.once("open", function () {
  console.log(colors.yellow(colors.bold("DeviceDB"))+" Connected to MongoDB through mongoose successfully");
});



const DeviceSchema = new Schema({


  service_id:{
    type:String,
    trim:true,
    required:true,
    maxlength:360,
    unique:true,
  },

  device:{
    type:Array,
    required:true
  }



});



const Device = db7.model('Device', DeviceSchema);

module.exports= Device;