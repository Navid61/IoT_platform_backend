const express = require("express");


const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorsGroup = require('../db/models/actuator')

const FilterRule = require('../db/models/filter');

const Device =require('../db/models/device');



const mongodb = require("../db/config/mongodb");
const UserGroup = require("../db/models/usergroup");
const actuatorSite = require("../db/models/actuatorSite");

const filterBoardDB = mongodb.filterBoardDB

const deviceDB = mongodb.deviceDB



const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)


router.post("/actuators/create", checkAuthenticated, async (req, res) => {


  const service_id = req.body.service_id
const groupName= req.body.name
  await ActuatorsGroup.find({service_id,service_id,group:groupName},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      res.status(304).json({msg:'Duplicate'})

     

    }else{
      (async()=>{
        return await deviceDB.collection("actuatorsgroups").insertOne({service_id:service_id,group:req.body.name,actuator:req.body.group})
            
            })().then((response)=>{
      
              if(response){
                res.status(200).json({msg:"Actuator group created successfully"})
              }
            
               
             
             
            })
    }
  }).clone().catch(function (err) {console.log(err)})

})


router.post("/actuators/getgroup", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id

  await ActuatorsGroup.find({service_id:service_id},{_id:0},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      console.log('result ', result)
    
     res.status(200).json({group:result})
     
    }

  }).clone().catch(function (err) {console.log(err)})


})


router.post("/actuators/removeactuatorgroup", checkAuthenticated, async (req, res) => {

  const service_id = req.body.service_id
  const actuatorRemoveList = req.body.remove




  for await(const s of actuatorRemoveList){

    (async()=>{
      await ActuatorsGroup.find({service_id:service_id,group:s.group},async(err, result)=>{
        if(err){
          throw new Error(err)
        }
  
        if(result){
  
         if(result.length!==0){
    

         await deviceDB.collection("actuatorsgroups").deleteOne({service_id:service_id,group:s.group})
        
  
         }
  
        }
  
  
      }).clone().catch(function (err) {console.log(err)})
  

    })().then(()=>{

      



       (async(service_id,s)=>{

      await FilterRule.find({service_id:service_id,rule:{$elemMatch:{actuator:s.group}}},async(err,result)=>{
        if(err){
          throw new Error(err)
        }

        if(result.length!==0){

          // console.log('result in filterboard ', result)
           await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$pull:{rule:{actuator:s.group}}})
        }
      }).clone().catch(function (err) {console.log(err)})
     

       })(service_id, s)
     
    })


  }

   res.status(200).json({"msg":"Actuator(s) Group Removed Successfully"})

})


router.post("/actuators/updateactuatorgroup", checkAuthenticated, async (req, res) => {
  const service_id=req.body.service_id
  const groupName = req.body.name
  const updateInfo = req.body.group


 

  await ActuatorsGroup.find({service_id:service_id,group:groupName},async(err,result)=>{

    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      (async()=>{
     await deviceDB.collection("actuatorsgroups").updateOne({service_id:service_id,group:groupName},{$set:{actuator:updateInfo}})

      })().then(()=>{
      
          res.status(200).json({"msg":"Actuator Group Updated Successfully"})
       
      })

    }

  }).clone().catch(function (err) {console.log(err)})





  

 
})


router.post("/actuators/getactuatordata",async (req, res) => {


  const service_id = req.body.service_id

  await actuatorSite.find({service_id:service_id},async(err,result)=>{

    if(err){
      throw new Error(err)
    }

   console.log('result actuatorSite ', result)

    if(result.length >0){

     

  

      await Device.find({service_id:service_id}, async(err,deviceResult)=>{
        if(err){
          throw new Error(err)
        }

        if(deviceResult.length > 0){

       
         
          const devicesSites = deviceResult[0].device
          const actuatorData = result[0].data

          let fillDevicesSites =[]

          for await (const site of devicesSites){
            for(let i=0;i<actuatorData.length;i++){
              if(actuatorData[i].device === site.device){
                fillDevicesSites.push({
                  id:actuatorData[i].id,
                  site:site.site,
                  device:actuatorData[i].device,
                  actuator:actuatorData[i].actuator,
                  name:actuatorData[i].name
                })

              }
            }
          }

          if(fillDevicesSites){

            const removedNullactuatorsValue =  fillDevicesSites.filter((item)=>{
              return item.actuator !== null && item.actuator !== undefined && item.actuator !== ''
             })

          //  console.log('fillDevices ', fillDevicesSites)
// console.log('removedNullActuatorsValue ', removedNullActuatorsValue)

            res.status(200).json({
              actuator:removedNullactuatorsValue
            })

          }

        }

      }).clone().catch(function (err) {console.log(err)})


      // console.log(`actuator data for ${service_id} is `, result[0].data)
    }

  }).clone()
  .catch(function (err) {
    console.log(err)
  })


})
   




module.exports = router;