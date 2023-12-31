const express = require("express")
const router = express.Router()
const colors = require("colors")
const axios = require("axios")

const mongodb = require('../db/config/mongodb');



const Service = require("../db/models/service")
const Control = require("../db/models/control")
const Account = require("../db/models/account")




 const filterBoardDB =mongodb.filterBoardDB
 const serviceDB =mongodb.serviceDB
//  const agentDB =mongodb.agentDB
//  const clientDB =mongodb.clientDB
 const usersDB =mongodb.usersDB
 const deviceDB=mongodb.deviceDB
 const sceneDB =mongodb.sceneDB
 const sensorSiteDB=mongodb.sensorSiteDB
 const actuatorSiteDB=mongodb.actuatorSiteDB

 const sigmaBoardDB=mongodb.sigmaBoardDB



const checkAuthenticated = function (req, res, next) {
  // console.log("req.isAuthenticated  in newService Router ", req.isAuthenticated())

  if (req.isAuthenticated()) {
    return next()
  }
}

router.use(checkAuthenticated)

///////////

function makeid(length) {
  var result = ""
  var characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

////////

router.get("/service", checkAuthenticated, async (req, res) => {




  try{

    await Service.find({}, async(err,result)=>{

      if(err){
        throw new Error('Error in detect system users in newServices file')
      }

    
    
       if(result.length !== 0){


          
            await Service.find({}, async (err, result) => {
              if (err) {
                throw new Error("get customer list and service failed")
              }
          
              if (result.length > 0) {

                // console.log('result in service ', result)
              
                res.status(200).json({
                  cid: result,
                })
              }
            })
              .clone()
              .catch(function (err) {
                console.log(err)
              })
    
          
        }
    
     
    }).clone().catch(function (err) {
                console.log(err)
              })

  }catch(e){

    console.error('error ', e)

  }



   


 
})

router.post("/service/status", checkAuthenticated, async (req, res) => {



  try{

    await Service.find({}, async(err,result)=>{

      if(err){
        throw new Error('Error in detect system users in newServices file')
      }

    
    
       if(result.length !== 0){


          
            await Service.find({}, async (err, result) => {
              if (err) {
                throw new Error("get customer list and service failed")
              }
          
              if (result.length > 0) {

                // console.log('result in service ', result)
              
                res.status(200).json({
                  cid: result,
                })
              }
            })
              .clone()
              .catch(function (err) {
                console.log(err)
              })
    
          
        }
    
     
    }).clone().catch(function (err) {
                console.log(err)
              })

  }catch(e){

    console.error('error ', e)

  }



   


 
})

router.post("/service", checkAuthenticated, async (req, res) => {
  try{
  const topic = req.body.topic
  const service_id = 'id-'+makeid(25) + '-' + Date.now()


  const owner = req.body.owner

  console.log('service ', req.body)

  if (req.body.task === "create" && owner.length > 0) {
// CHECK USER ACCOUNT IS EXIST OR NOT

  await Account.find({username:req.body.owner},async(err,result)=>{
    if(err){
      throw new Error(err)
    }
 
    if(result.length!==0){
     if(result[0].role!=='owner'){
      try {
  // Initialize database connections

  await sigmaBoardDB.collection("accounts").findOneAndUpdate({username:req.body.owner},{$set:{role:"owner"}})
        
      } catch (error) {
        console.error("Error fetching stream data:", error);
      
      }
    
      if(result[0].verification!==true){
        try {
           // Initialize database connections

          await sigmaBoardDB.collection("accounts").findOneAndUpdate({username:req.body.owner},{$set:{verification:true}})
        } catch (error) {
          console.error("Error fetching stream data:", error);
        }
      
      }

      // BELOW CODE RUN FOR FIRST TIME
      const checkExistService = await Service.find(
        { topic:topic },
        async (err, result) => {
          if (err) {
            throw new Error("Service Databased failed!")
          }
          return result
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err)
        })
  
      if (checkExistService.length === 0) {
        const newService = new Service({
          service_id:service_id,
          topic: topic,
          owner: req.body.owner,
          keeper:req.body.keeper,
          place: req.body.place,
          phone: req.body.phone,
          keepertel: req.body.keepertel,
          idcard: req.body.idcard,
          postcode: req.body.postcode,
          role: "owner",
          start: new Date().toISOString(),
          status: true,
        })
  
    await newService.save()
  
   
  
         
         res.status(200).json({
          status:200,
          msg:'new service created successfully'
        })
      }
   
     }else{
      const checkExistService = await Service.find(
        { topic:topic },
        async (err, result) => {
          if (err) {
            throw new Error("Service Databased failed!")
          }
          return result
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err)
        })
  
      if (checkExistService.length === 0) {
        const newService = new Service({
          service_id:service_id,
          topic: topic,
          owner: req.body.owner,
          keeper:req.body.keeper,
          place: req.body.place,
          phone: req.body.phone,
          keepertel: req.body.keepertel,
          idcard: req.body.idcard,
          postcode: req.body.postcode,
          role: "owner",
          start: new Date().toISOString(),
          status: true,
        })
  
    await newService.save()
  
   
  
         
         res.status(200).json({
          status:200,
          msg:'new service created successfully'
        })
      }
     }
    }
  
  }) .clone()
        .catch(function (err) {
          console.log(err)
        })

}


   
  } catch(e){
    console.error('erro in newService page ',e)
  }
})


router.post("/service/remove", checkAuthenticated, async (req, res) => {

  const removeServiceList = req.body.remove





 await (async(r)=>{
    for await (const r of removeServiceList){
await filterBoardDB.collection("filterrules").findOneAndDelete({service_id:r.service_id})
await filterBoardDB.collection("userfilters").findOneAndDelete({service_id:r.service_id})
await deviceDB.collection("actuatorgroups").findOneAndDelete({service_id:r.service_id})
await deviceDB.collection("devices").findOneAndDelete({service_id:r.service_id})
await deviceDB.collection("sensorsgroups").findOneAndDelete({service_id:r.service_id})
await sceneDB.collection("scenes").findOneAndDelete({service_id:r.service_id})
await usersDB.collection("usergroups").findOneAndDelete({service_id:r.service_id})
await usersDB.collection("users").findOneAndDelete({service_id:r.service_id})
await sensorSiteDB.collection('sensorsites').findOneAndDelete({service_id:r.service_id})
await actuatorSiteDB.collection('actuatorsites').findOneAndDelete({service_id:r.service_id})
// await agentDB.collection("usergroups").findOneAndDelete({service_id:r.service_id})
await serviceDB.collection("services").findOneAndDelete({service_id:r.service_id})
}

  })().then(()=>{
  res.status(200).json({msg:'selected service(s) deleted permanently'})
}).catch((e)=>{
  console.error('e ', e)
})

 
})




module.exports = router
