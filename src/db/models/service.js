const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { v4: uuidv4 } = require("uuid")
const colors = require("colors")

let serviceDB = "mongodb://127.0.0.1:27017/service"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn3 = mongoose.createConnection(serviceDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db3 = conn3

db3.on("error", console.error.bind(console, "connection error: "))
db3.once("open", function () {
  console.log(
    colors.cyan(colors.bold("ServiceDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const ServiceSchema = new Schema({
  service_id: {
    type: String,
    maxLength: 90,
    trim: true,
    required: true,
  },

  topic: {
    type: String,
    maxLength: 255,
    trim: true,
    unique: true,
    required: true,
  },
  owner: {
    type: String,
    lowercase: true,
    trim: true,
    maxLength: 255,
    minLength: 3,
    required: true,
  },


  place: {
    type: String,
    trim: true,
    maxLength: 500,
  },

  phone: {
    type: Number,
    trim: true,
    maxLength: 13,
  },

 

  idcard: {
    type: String,
    trim: true,
    maxLength: 50,
  },

  postcode: {
    type: String,
    trim: true,
    maxLength: 50,
  },

  role: {
    type: String,
    default: "owner",
    required: true,
    trim: true,
    lowercase: true,
  },

  location: [],

  start: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
    required: true,
  },
})

const Service = db3.model("Service", ServiceSchema)

module.exports = Service
