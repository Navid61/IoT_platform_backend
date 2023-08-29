const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require("colors");

let automationDB = "mongodb://127.0.0.1:27017/automation";
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn56a = mongoose.createConnection(automationDB);
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error);
}

const db56a = conn56a;

db56a.on("error", console.error.bind(console, "connection error: "));
db56a.once("open", function () {
  console.log(
    colors.cyan(colors.bold("AutomationDB")) +
      " Connected to MongoDB through mongoose successfully"
  );
});

const AutomationSchema = new Schema({
  service_id: {
    type: String,
    trim: true,
    default: "99999",
    required: true,
    maxLength: 360,
  },

  topic: {
    type: String,
    maxLength: 255,
    trim: true,
    unique: true,
    required: true,
  },

  device_id: {
    type: Array,
    required: true,
  },

  sensors_id: {
    type: Array,
    required: true,
  },

  actuators_id: {
    type: Array,
    required: true,
  },


  command: {
    type: String,
    required: true,
  },

  status: {
    type: Boolean,
    deafult: true,
    required: true,
  },
});

const Stream = db56a.model("Stream", AutomationSchema);

module.exports = Stream;
