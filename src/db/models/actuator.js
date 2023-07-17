const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")


// it must change to actuactorsGroup not remain device
let actuatorsGroupDB= "mongodb://127.0.0.1:27017/actuatorsgroup"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn16 = mongoose.createConnection(actuatorsGroupDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db16 = conn16

db16.on("error", console.error.bind(console, "connection error: "))
db16.once("open", function () {
  console.log(
    colors.red(colors.bold("actuatorsGroupDB")) +
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
  actuator: [],
})

const ActuatorsGroup = db16.model("ActuatorsGroup", ActuatorGroupSchema)

module.exports = ActuatorsGroup
