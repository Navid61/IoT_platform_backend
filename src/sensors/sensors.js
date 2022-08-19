const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')



const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB

const filterBoardDB= mongodb.filterBoardDB


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)




router.post("/sensors", checkAuthenticated, async (req, res) => {
    console.log('req.body' , req.body)

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
       return await filterBoardDB.collection("sensorsgroups").insertOne({service_id:service_id,group:req.body.name,sensor:req.body.group})
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
   

    





 

 


module.exports = router;