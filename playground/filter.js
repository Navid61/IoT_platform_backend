//   await getInfo(zone,db).then(async(response)=>{
//     if(response){
//       // console.log('response ', response)
//   await Account.find({username:req.user.username},async(err,role)=>{
//     if(err){
//       throw Error({err:err})
//     }

//     if(role){
//       if(role.length >0){
//         if(role[0].role==='admin'){
//           filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.user.username}`},{$set:{role:'admin'}});
         
     
//              const sensorsList = response
//          const filterationRuleTable=[]
//            await  UserFilter.find({},async(err,result)=>{
//               if(err){
//                 throw Error(err)
//               }

//               if(result){
//                 if(result.length >0){
//                   // console.log('list of user filteration rule', result)
//                   result.forEach(filter=>{

//                     for(let i=0;i<filter.sensor.length;i++){
//                       const filterTable={
//                         username:filter.username,
//                         role:filter.role,
//                         sensor:filter.sensor[i]
//                       }
//                         if(filter.role !=='admin'){
//               filterationRuleTable.push(filterTable)
//                                       }

//                     }
                                      
//                   })
                  
//                 }
               
//               }

//               // console.log('filteration Table ',filterationRuleTable)
//               // console.log('sensorsList ',sensorsList)
//               res.status(200).json({sensor:sensorsList,
//                filterTable:filterationRuleTable})

//              }).clone().catch(function(err){ console.log(err)});

             
           
          
          
//         }else if(role[0].role==='user'){
//           res.json({status:403})
//         }
        
//       }
//     }


//   }).clone().catch(function(err){ console.log(err)});

  
// }

// })




//// MODEL 



const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require('uuid');
const colors = require('colors');



let filterBoardDB='mongodb://127.0.0.1:27017/filterboard';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
   
  var conn2=  mongoose.createConnection(filterBoardDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}


const db2 = conn2

db2.on("error", console.error.bind(console, "connection error: "));
db2.once("open", function () {
  console.log(colors.magenta(colors.bold("filterBoardDB"))+" Connected to MongoDB through mongoose successfully");
});


const UserFilterationSchema = new Schema({
username:{
        type:String,
        lowercase:true,
        trim:true,
        maxlength:255,
        minlength:3,
        unique:true,
},
role:{
       type:String,
       deafult:"user",
       lowercase:true,
       maxlength:25,
       trim:true,
       required:true,
},

sensor:[],

status:{
    type:Boolean,
    deafult:true,
    required:true,
},


});



const UserFilter = db2.model('UserFilter', UserFilterationSchema);

module.exports= UserFilter;