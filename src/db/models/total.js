const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require("colors");

// Database URL
const totalDB = "mongodb://127.0.0.1:29019/total";

// Connect to MongoDB through Mongoose
mongoose.connect(totalDB);

// Handle connection events
mongoose.connection.on("error", error => {
    console.error("mongoose error", error);
});

mongoose.connection.once("open", function () {
    console.log(colors.red(colors.bold("totalDB")) + " Connected successfully");
});

// Define your schema
const totalDataSchema = new Schema({
    service_id: {
        type: String,
        required: true,
        trim: true,
        maxLength: 360
    },
    topic: {
        type: String,
        maxLength: 255,
        trim: true,
        unique: true,
        required: true,
    },
    data:[]
});

// Create and export the model
const totalData = mongoose.model("totalData", totalDataSchema);
module.exports = totalData;
