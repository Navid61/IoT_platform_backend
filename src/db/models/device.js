const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const DeviceListSchema = new Schema({


location:[[]]


});



const DeviceList = mongoose.model('DeviceList', DeviceListSchema);

module.exports= DeviceList;