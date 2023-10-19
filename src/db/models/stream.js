const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { v4: uuidv4 } = require("uuid")
const colors = require("colors")

let streamDB = "mongodb://127.0.0.1:27017/stream";
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
let conn56a;
try {
   conn56a = mongoose.createConnection(streamDB);
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error);
}

const db56a = conn56a;

db56a.on("error", console.error.bind(console, "connection error: "));
db56a.once("open", function () {
  console.log(
    colors.cyan(colors.bold("streamDB")) +
      " Connected to MongoDB through mongoose successfully"
  );
});

const StreamSchema = new Schema({

  service_id: {
    type: String,
    trim: true,
    default: "99999",
    required: true,
    maxLength: 360,
  },

  startDay: {
    type: Date,
    default: Date.now,
    required: true,
    validate: {
      validator: function (v) {
        return v instanceof Date;
      },
      message: "Start day must be a valid date",
    },
    get: function (v) {
      return v.toISOString();
    },
  },

  expireDate: {
    type: Date,
    validate: {
      validator: function (v) {
        return v instanceof Date;
      },
      message: "Expire date must be a valid date",
    },
    get: function (v) {
      return v.toISOString();
    },
  },

  dayOfWeek: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.every(day => typeof day === 'string' && day === day.toLowerCase());
      },
      message: "Days of the week must be an array with all elements lowercase strings",
    },
  },

  timeInterval: {
    type: Number,
    required:true,
    default:1000,
    validate: {
      validator: function (v) {
        return Number.isInteger(v) && v>0 && v <= 1000000;
      },
      message: "myNumber must be an integer less than or equal to 1000000",
    },
  },



  streamName:{
    type: String,
    maxLength: 200,
    trim: true,
    required: true,
  },

  sceneName:{
    type: String,
    maxLength: 200,
    trim: true,
    required: true,
  },
  

  conditions:[],

    
  status: {
    type: Boolean,
    deafult: true,
    required: true,
  },
});

const Stream = db56a.model("Stream", StreamSchema);

module.exports = Stream;
