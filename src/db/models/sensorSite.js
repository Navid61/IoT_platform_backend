const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")

let sensorSiteDB= "mongodb://127.0.0.1:27017/sensor"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn21 = mongoose.createConnection(sensorSiteDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db21 = conn21

db21.on("error", console.error.bind(console, "connection error: "))
db21.once("open", function () {
  console.log(
    colors.red(colors.bgBlue("sensorSiteDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const sensorSiteSchema = new Schema({
  service_id: {
    type: String,
    required: true,
    trim: true,
    maxLength:360
   
  },
  
  data: [],
})

const sensorSite = db21.model("sensorSite", sensorSiteSchema)

module.exports = sensorSite
