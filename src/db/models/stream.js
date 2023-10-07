const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require("colors");

let streamDB = "mongodb://127.0.0.1:27017/stream";
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn56a = mongoose.createConnection(streamDB);
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

const StreamSchema = new Schema({

  service_id: {
    type: String,
    trim: true,
    default: "99999",
    required: true,
    maxLength: 360,
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
