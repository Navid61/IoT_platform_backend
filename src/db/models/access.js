const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');



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



const UserAccess = mongoose.model('UserAccess', UserAccessSchema);

module.exports= UserAccess;