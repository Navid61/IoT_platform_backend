const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');

var sigmaBoardDB='mongodb://127.0.0.1:27017/sigmaboard';

try {
  var conn99 = mongoose.createConnection(sigmaBoardDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db99 = conn99

db99.on("error", console.error.bind(console, "connection error: "))
db99.once("open", function () {
  console.log(
    colors.cyan(colors.bold("sigmaBoardDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

db99.on('disconnected', function() {
  console.log("Disconnected from DB!" ,'serviceDB');
  // You might decide to try and reconnect here
});



const UserAccessSchema = new Schema({
username:{
        type:String,
        lowercase:true,
        trim:true,
        maxLength:255,
        minLength:3,
        unique:true,
},
role:{
       type:String,
       deafult:"user",
       lowercase:true,
       maxLength:25,
       trim:true,
       required:true,
},

query:[
    {
   database:{
            type:String,
            lowercase:true,
            trim:true,
        },
    zone:{
        type:String,
        trim:true,
        required:true,
        default:"zone",
        lowercase:true,
     },
 device:[
            {
           name:{
               type:String,
               trim:true,
               default:uuidv4(),
               required:true,
               unique:true,
              },
              sensor:[{
                  id:{
                      type:Number,
                  },
                name:{
                    type:String,
                    required:true,
                    trim:true,
                    default:"none"
                },
             
            }]
        },
      ],
   
    
  
   
   
    
}],
status:{
    type:Boolean,
    deafult:true,
    required:true,
},


});



const UserAccess = db99.model('UserAccess', UserAccessSchema);

module.exports= UserAccess;