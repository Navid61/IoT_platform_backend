const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorsGroup = require('../db/models/actuator')

const FilterRule = require('../db/models/filter')

const Scene = require('../db/models/scene');

const Device = require("../db/models/device")


const mongodb = require("../db/config/mongodb");
const UserGroup = require("../db/models/usergroup");

const filterBoardDB = mongodb.filterBoardDB

const sceneDB = mongodb.sceneDB

const sensorSite = require("../db/models/sensorSite");
const actuatorSite = require("../db/models/actuatorSite");


const deviceDB = mongodb.deviceDB


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)


router.get("/stream/:id", checkAuthenticated, async (req, res) => {
  const service_id=req.params.id

// console.log('service_id in stream part ', service_id);
  await Scene.find({service_id:service_id},{_id:0}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

      // console.log('result ', result)

  
           res.status(200).json({scenes:result})
 

        
       
    }
 }).clone().catch(function (err) {console.log(err)})


})



router.post("/stream/getdevicesite", checkAuthenticated, async (req, res) => {
  const service_id=req.body.id

// console.log('service_id in stream part ', service_id);


await Device.find({service_id:service_id},{_id:0}, async(err,result)=>{
  if(err){
      throw new Error(err)
  }

  if(result.length!==0){

  // console.log('result ', result[0].device)

  
// Attention Data must be store an array even for one device site
  if (Array.isArray(result[0].device) && result[0].device.length > 0) {
   const deviceSitesNameList = result[0].device.every(element => element.site && element.site !== '');

    if (deviceSitesNameList) {
      res.status(200).json({ devices: result[0].device });
    } else {
      res.status(404).json({ message: "No device sites found" });
    }
   
 } else {
  res.status(404).json({ message: "No zites found for the given service ID and devices" });
}



     
     
  }
}).clone().catch(function (err) {console.log(err)})


})


router.post("/stream/getsensorslist", checkAuthenticated, async (req, res) => {

  const service_id=req.body.id
  const deviceName = req.body.device

  let sensorsInDevice =[]

  // console.log('service_id in getsensorslist ', service_id)

  try {

    await sensorSite.find({service_id:service_id}, async(err,result)=>{
      if(err){
          throw new Error(err)
      }
  
      if(result.length > 0){
        //  console.log('result ', result[0].data)
        const sensorsData = result[0].data
        if(sensorsData.length > 0){
          sensorsInDevice = sensorsData.filter((item)=>{
            if(item.device===deviceName){
              return item
            }else {
  return ''
            }
          });
        }
     
        // console.log('sensors in device ', sensorsInDevice)
        if(sensorsInDevice && sensorsInDevice!==null && sensorsInDevice!==undefined){
          res.status(200).json({sensor:sensorsInDevice})
        }
       
  
      }
    }).clone().catch(function (err) {console.log(err)})
  
    
  } catch (error) {
    console.log('error in get sensors list in device ', error);
  }

  

})







router.post("/stream/getactuatorslist", checkAuthenticated, async (req, res) => {

  const service_id=req.body.id
  const deviceName = req.body.device

  let actuatorsInDevice =[]

  // console.log('service_id in getactuatorslist ', service_id)

  try {

    await actuatorSite.find({service_id:service_id}, async(err,result)=>{
      if(err){
          throw new Error(err)
      }
  
      if(result.length > 0){
        // console.log('result ', result[0].data)
        const actuatorsData = result[0].data
        if(actuatorsData.length > 0){
          actuatorsInDevice = actuatorsData.filter((item)=>{
            if(item.device===deviceName){
              return item
            }else {
  return ''
            }
          });
        }
     
        // console.log('actuators in device ', actuatorsInDevice)
        if(actuatorsInDevice && actuatorsInDevice!==null && actuatorsInDevice!==undefined){
          res.status(200).json({actuator:actuatorsInDevice})
        }
       
  
      }
    }).clone().catch(function (err) {console.log(err)})
  
    
  } catch (error) {
    console.log('error in get actuators list in device ', error);
  }

  


})


module.exports = router;