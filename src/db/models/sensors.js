const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")
//sensors group data store in device database
let deviceDB= "mongodb://127.0.0.1:27017/device"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn55 = mongoose.createConnection(deviceDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db55 = conn55

db55.on("error", console.error.bind(console, "connection error: "))
db55.once("open", function () {
  console.log(
    colors.yellow(colors.bold("deviceDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const SensorsGroupSchema = new Schema({
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
  sensor: []
})

const SensorsGroup = db55.model("SensorsGroup", SensorsGroupSchema)

module.exports = SensorsGroup
