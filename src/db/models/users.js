const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { v4: uuidv4 } = require("uuid")
const colors = require("colors")

let usersDB = "mongodb://127.0.0.1:27017/users"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn6 = mongoose.createConnection(usersDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db6 = conn6

db6.on("error", console.error.bind(console, "connection error: "))
db6.once("open", function () {
  console.log(
    colors.cyan(colors.bold("UsersDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const UsersSchema = new Schema({
  username: {
    type: String,
    maxLength: 360,
    trim: true,
    required: true,
  },
  service_id: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
    trim: true,
    lowercase: true,
  },

  adddate: {
    type: Date,
    default: new Date().toISOString(),
    required: true,
  },

  removedate: {
    type: Date,
  },

  modifydate: {
    type: Date,
  },
})

const Users = db6.model("Users", UsersSchema)

module.exports = Users
