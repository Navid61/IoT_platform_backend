const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")

let actuatorSiteDB= "mongodb://127.0.0.1:27017/sensor"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn210 = mongoose.createConnection(actuatorSiteDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db210 = conn210

db210.on("error", console.error.bind(console, "connection error: "))
db210.once("open", function () {
  console.log(
    colors.red(colors.bgBlue("sensorSiteDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const actuatorSiteSchema = new Schema({
  service_id: {
    type: String,
    required: true,
    trim: true,
    maxLength:360
   
  },
  
  data: [],
})

const actuatorSite = db210.model("actuatorSite", actuatorSiteSchema)

module.exports = actuatorSite
