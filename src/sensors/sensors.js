const express = require("express");


const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const FilterRule = require('../db/models/filter')





const mongodb = require("../db/config/mongodb");

const filterBoardDB = mongodb.filterBoardDB


const deviceDB = mongodb.deviceDB



const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)




router.post("/sensors", checkAuthenticated, async (req, res) => {
   

    const service_id=req.body.service_id
    const groupName= req.body.name

try{
  await SensorsGroup.find({service_id:service_id,group:groupName},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){
    
      console.log('result ', result)
      res.status(304).json({msg:"Duplicate"})
     
    }else{

      (async()=>{
       return await deviceDB.collection("sensorsgroups").insertOne({service_id:service_id,group:req.body.name,sensor:req.body.group})
      })().then((response)=>{

        if(response){
          res.status(200).json({msg:"seonsors group created successfully"})
        }
      
         
       
       
      })
     
    }

  }).clone().catch(function (err) {console.log(err)})


}catch(e){
  console.error('error in sensors ', e)
}
   


})


router.post("/sensors/getgroup", checkAuthenticated, async (req, res) => {
  const service_id = req.body.service_id

  await SensorsGroup.find({service_id:service_id},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){
    
     res.status(200).json({group:result})
     
    }

  }).clone().catch(function (err) {console.log(err)})

 
})


// Remove Sensor Group
router.post("/sensors/removesensorgroup", checkAuthenticated, async (req, res) => {

  const service_id = req.body.service_id
  const sensorRemoveList = req.body.remove




  for await(const s of sensorRemoveList){

    (async()=>{
      await SensorsGroup.find({service_id:service_id,group:s.group},async(err, result)=>{
        if(err){
          throw new Error(err)
        }
  
        if(result){
  
         if(result.length!==0){
  
    if(result[0]._id.toString()===s._id){
  
    
  await deviceDB.collection("sensorsgroups").deleteOne({group:s.group})
  
  
  
    }
     
  
  
  
         }
  
        }
  
  
      }).clone().catch(function (err) {console.log(err)})
  

    })().then(()=>{

      



       (async(service_id,s)=>{

      await FilterRule.find({service_id:service_id,rule:{$elemMatch:{sensors:s.group}}},async(err,result)=>{
        if(err){
          throw new Error(err)
        }

        if(result.length!==0){

          // console.log('result in filterboard ', result)
           await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$pull:{rule:{sensors:s.group}}})
        }
      }).clone().catch(function (err) {console.log(err)})
     

       })(service_id, s)
     
    })


  }

  res.status(200).json({"msg":"Sensor(s) Group Removed Successfully"})

})
   

    





 

 


module.exports = router;