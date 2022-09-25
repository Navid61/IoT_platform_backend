const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { v4: uuidv4 } = require("uuid")
const colors = require("colors")

let filterBoardDB = "mongodb://127.0.0.1:27017/filterboard"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn2 = mongoose.createConnection(filterBoardDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db2 = conn2

db2.on("error", console.error.bind(console, "connection error: "))
db2.once("open", function () {
  console.log(
    colors.magenta(colors.bold("filterBoardDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const UserFilterationSchema = new Schema({
  service_id: {
    type: String,
    trim: true,
    required: true,
   
  
  },

  rule: [
    {
      sensors: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 255,
        required: true,
      },

      users: {
        type: String,
        lowercase: true,
        trim: true,
        maxlength: 255,
        required: true,
      },
      view: {
        type: Boolean,
        required: true,
        default: true,
      },
      action: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
  ],
})

const FilterRule = db2.model("FilterRule", UserFilterationSchema)

module.exports = FilterRule
