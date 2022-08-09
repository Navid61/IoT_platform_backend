const mongoose = require("mongoose")
const Schema = mongoose.Schema

const colors = require("colors")

let usersDB = "mongodb://127.0.0.1:27017/users"
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn9 = mongoose.createConnection(usersDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db9 = conn9

db9.on("error", console.error.bind(console, "connection error: "))
db9.once("open", function () {
  console.log(
    colors.cyan(colors.bold("UsersDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

const UserGroupSchema = new Schema({
 
  service_id: {
    type: String,
    required: true,
    trim: true,
    unique:true,
  },
  group:[],

 
})

const UserGroup = db9.model("UserGroup", UserGroupSchema)

module.exports = UserGroup
