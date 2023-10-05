const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require("colors");

let streamDB = "mongodb://127.0.0.1:27017/stream";
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn56b = mongoose.createConnection(streamDB);
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error);
}

const db56b = conn56b;

db56b.on("error", console.error.bind(console, "connection error: "));
db56b.once("open", function () {
  console.log(
    colors.yellow(colors.bold("AutomationDB")) +
      " Connected to MongoDB through mongoose successfully"
  );
});

const StreamSetupSchema = new Schema({

  service_id: {
    type: String,
    trim: true,
    default: "99999",
    required: true,
    maxLength: 255,
  },

 stream_id:{
    type: String,
    trim: true,
    required: true,
    maxLength: 250,

 },
  name:{
    type: String,
    maxLength: 200,
    trim: true,
    required: true,
  },

  interval:{
    type:Number,
  },

  
  start:{
    type:Date
  },
  end:{
    type:Date
  },
  days:[],



    
  status: {
    type: Boolean,
    deafult: true,
    required: true,
  },
});

const StreamSetup = db56b.model("StreamSetup", StreamSetupSchema);

module.exports = StreamSetup;
