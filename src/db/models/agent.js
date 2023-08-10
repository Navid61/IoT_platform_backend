const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const colors = require('colors');



let agentDB='mongodb://127.0.0.1:27017/agent';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn54=  mongoose.createConnection(agentDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db54 = conn54

db54.on("error", console.error.bind(console, "connection error: "));
db54.once("open", function () {
  console.log(colors.cyan(colors.bold("agentDB"))+" Connected to MongoDB through mongoose successfully");
});


const AgentSchema = new Schema({

username:{
        type:String,
        lowercase:true,
        trim:true,
        maxLength:255,
        minLength:3,
        unique:true
       
},
role:{
        type:String,
        lowercase:true,
        trim:true,
        default:'installer',
        maxLength:75,
       
},

status:{
    type:Boolean,
    deafult:true,
    required:true,
},


});



const Agent = db54.model('Agent', AgentSchema);

module.exports= Agent;