const express = require("express");


const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorGroup = require('../db/models/actuator')

const FilterRule = require('../db/models/filter')



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


router.post("/actuators/create", checkAuthenticated, async (req, res) => {


  const service_id = req.body.service_id
const groupName= req.body.name
  await ActuatorGroup.find({service_id,service_id,group:groupName},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      res.status(304).json({msg:'Duplicate'})

     

    }else{
      (async()=>{
        return await deviceDB.collection("actuatorgroups").insertOne({service_id:service_id,group:req.body.name,actuator:req.body.group})
            
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

  await ActuatorGroup.find({service_id:service_id},{_id:0},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length!==0){

      console.log('result ', result)
    
     res.status(200).json({group:result})
     
    }

  }).clone().catch(function (err) {console.log(err)})


})




module.exports = router;