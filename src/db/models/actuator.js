const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")



// actuator collection store in device database
let deviceDB= "mongodb://127.0.0.1:27017/device"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn16 = mongoose.createConnection(deviceDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db16 = conn16

db16.on("error", console.error.bind(console, "connection error: "))
db16.once("open", function () {
  console.log(
    colors.red(colors.bold("deviceDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const ActuatorGroupSchema = new Schema({
  service_id: {
    type: String,
    required: true,
    trim: true,
    maxLength:360
   
  },
  group:{
    type:String,
    trim:true,
    required:true,
   maxLength:360,
    
  },
  actuator: []
})

const ActuatorsGroup = db16.model("ActuatorsGroup", ActuatorGroupSchema)

module.exports = ActuatorsGroup
