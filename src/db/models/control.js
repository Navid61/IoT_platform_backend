const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require('colors');



let agentDB='mongodb://127.0.0.1:27017/agent';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn4=  mongoose.createConnection(agentDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db4 = conn4

db4.on("error", console.error.bind(console, "connection error: "));
db4.once("open", function () {
  console.log(colors.cyan(colors.bold("AgentDB"))+" Connected to MongoDB through mongoose successfully");
});


const ControlSchema = new Schema({

username:{
        type:String,
        lowercase:true,
        trim:true,
        maxlength:255,
        minlength:3,
        unique:true
       
},
phone:{
    type:String,
    trim:true,
    maxlength:20,
},
role:{
        type:String,
        lowercase:true,
        trim:true,
        default:'sysman',
        maxlength:75,
       
},

status:{
    type:Boolean,
    deafult:true,
    required:true,
},


});



const Control = db4.model('Control', ControlSchema);

module.exports= Control;