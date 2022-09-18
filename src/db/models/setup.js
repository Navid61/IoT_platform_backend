const mongoose = require("mongoose")
const Schema = mongoose.Schema
const colors = require("colors")

let deviceDB = "mongodb://127.0.0.1:27017/device"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn8 = mongoose.createConnection(deviceDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db8 = conn8

db8.on("error", console.error.bind(console, "connection error: "))
db8.once("open", function () {
  console.log(
    colors.yellow(colors.bold("deviceDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const SetupDeviceSchema = new Schema({
  topic: {
    type: String,
    trim: true,
    required: true,
    maxlength: 360,
    unique: true,
  },

  service_id: {
    type: String,
    trim: true,
    required: true,
    maxlength: 360,
  },

  setup: [],
})

const SetupDevice = db8.model("SetupDevice", SetupDeviceSchema)

module.exports = SetupDevice
