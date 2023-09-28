const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require("colors");

let totalDB = "mongodb://127.0.0.1:28018/total";
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
  var conn70a = mongoose.createConnection(totalDB);
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error);
}

const db70a = conn70a;

db70a.on("error", console.error.bind(console, "connection error: "));
db70a.once("open", function () {
  console.log(
    colors.red(colors.bold("totalDB")) +
      " Connected to MongoDB through mongoose successfully"
  );
});

const totalDataSchema = new Schema({


});

const totalData = db70a.model("totalData", totalDataSchema);

module.exports = totalData;
