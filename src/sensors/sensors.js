const express = require("express");


const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const FilterRule = require('../db/models/filter')

const Device = require('../db/models/device')

const sensorSite = require("../db/models/sensorSite")




const mongodb = require("../db/config/mongodb");
const UserGroup = require("../db/models/usergroup");

const filterBoardDB = mongodb.filterBoardDB


const deviceDB = mongodb.deviceDB



const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)




router.post("/sensors/createnewgroup", checkAuthenticated, async (req, res) => {
   

    const service_id=req.body.service_id
    const groupName= req.body.name

    const sensorGroup = req.body.group
//  console.log('receieved data ', service_id, groupName,sensorGroup)
   

  await SensorsGroup.find({service_id:service_id,group:groupName},async(err,result)=>{
    if(err){
      throw new Error(err)
    }


   

    if(result.length > 0){
    
    
      res.status(304).json({msg:"Duplicate"})
     
    }else{

      (async()=>{
await SensorsGroup.collection("sensorsgroups").insertOne({service_id:service_id,group:groupName,sensor:sensorGroup})
      
      })().then(()=>{

      
          res.status(200).json({msg:"seonsors group created successfully"})
       
      
         
       
       
      })
     
    }

  }).clone().catch(function (err) {console.log(err)})





})


router.post("/sensors/getsensordata", checkAuthenticated, async (req, res) => {

    const service_id = req.body.service_id

  await sensorSite.find({service_id:service_id},async(err,result)=>{

    if(err){
      throw new Error(err)
    }

    // console.log('result sensorSite ', result)

    if(result.length >0){

     

  

      await Device.find({service_id:service_id}, async(err,deviceResult)=>{
        if(err){
          throw new Error(err)
        }

        if(deviceResult.length > 0){

       
         
          const devicesSites = deviceResult[0].device
          const sensorData = result[0].data

          let fillDevicesSites =[]

          for await (const site of devicesSites){
            for(let i=0;i<sensorData.length;i++){
              if(sensorData[i].device === site.device){
                fillDevicesSites.push({
                  id:sensorData[i].id,
                  site:site.site,
                  device:sensorData[i].device,
                  sensor:sensorData[i].sensor,
                  name:sensorData[i].name
                })

              }
            }
          }

          if(fillDevicesSites){

          console.log('fillDevices ', fillDevicesSites)
            res.status(200).json({
              sensor:fillDevicesSites
            })

          }

        }

      }).clone().catch(function (err) {console.log(err)})


      // console.log(`sensor data for ${service_id} is `, result[0].data)
    }

  }).clone()
  .catch(function (err) {
    console.log(err)
  })

})


router.post("/sensors/getgroup", checkAuthenticated, async (req, res) => {
  const service_id = req.body.service_id



  await SensorsGroup.find({service_id:service_id},{_id:0},async(err,result)=>{
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
        //  for(let r=0;r<result.length;r++){
        //   console.log('result[0] ', result[r]._id.toString())
          
        //  }


         await SensorsGroup.collection("sensorsgroups").deleteOne({service_id:service_id,group:s.group})
        
  
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


router.post("/sensors/updatesensorgroup", checkAuthenticated, async (req, res) => {
  const service_id=req.body.service_id
  const groupName = req.body.name
  const updateInfo = req.body.group


  console.log('updateInfo ', updateInfo)

  await SensorsGroup.find({service_id:service_id,group:groupName},async(err,result)=>{

    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      (async()=>{
     await SensorsGroup.collection("sensorsgroups").updateOne({service_id:service_id,group:groupName},{$set:{sensor:updateInfo}})

      })().then(()=>{
      
          res.status(200).json({"msg":"Sensor Group Updated Successfully"})
       
      })

    }

  }).clone().catch(function (err) {console.log(err)})





 

 
})
   

    





 

 


module.exports = router;