const express = require("express");


const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorGroup = require('../db/models/actuator')

const FilterRule = require('../db/models/filter')

const Scene = require('../db/models/scene');


const mongodb = require("../db/config/mongodb");
const UserGroup = require("../db/models/usergroup");

const filterBoardDB = mongodb.filterBoardDB

const sceneDB = mongodb.sceneDB


const deviceDB = mongodb.deviceDB


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)


router.get("/scenes/:id", checkAuthenticated, async (req, res) => {
  const service_id=req.params.id


  await Scene.find({service_id:service_id},{_id:0}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

  
           res.status(200).json({scenes:result})
 

        
       
    }
 }).clone().catch(function (err) {console.log(err)})


})


router.post("/scenes/create", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id
  const name = req.body.name
  const scenes = req.body.scenes


  console.log('req.body ', req.body)

 await Scene.find({service_id:service_id,name:name}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length===0){

        await (async()=>{
            await sceneDB.collection("scenes").insertOne({service_id:service_id,name:name,scenes:scenes})
        })().then(()=>{
            res.status(200).json({msg:`${name} created successfully`})
        })

        
       
    }
 }).clone().catch(function (err) {console.log(err)})

  


})




router.post("/scenes/duplicate", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id
  const name = req.body.name




 await Scene.find({service_id:service_id,name:name}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

      res.status(409).json({msg:`This name ${name} already exist`})
          
     

        
       
    }else{
      res.status(200).json({msg:'ok'})
    }
 }).clone().catch(function (err) {console.log(err)})

  


})



router.post("/scenes/query", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id
  const name = req.body.name




 await Scene.find({service_id:service_id,name:name},{_id:0}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

      res.status(200).json({query:result[0]})
        
       
    }
 }).clone().catch(function (err) {console.log(err)})

  


})


router.post("/scenes/update", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id
  const name = req.body.name
  const updatedScenes = req.body.update
console.log('updateScenes ', updatedScenes)



 await Scene.find({service_id:service_id,name:name},{_id:0}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

      (async()=>{
await sceneDB.collection("scenes").updateOne({service_id:service_id,name:name}, {$set:{scenes:updatedScenes}})
      })().then(()=>{
        res.status(200).json({msg:'scene updated successfully'})
      })
        
       
    }
 }).clone().catch(function (err) {console.log(err)})

  


})












module.exports = router;