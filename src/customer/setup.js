const express = require("express")
const router = express.Router()
const colors = require("colors")
const axios = require("axios")

const mongodb = require("../db/config/mongodb")
const servicedb = mongodb.serviceDB
const agentDB= mongodb.agentDB

const Service = require("../db/models/service")
const Control = require("../db/models/control")

const checkAuthenticated = function (req, res, next) {
  console.log("req.isAuthenticated  in Dashbaord ", req.isAuthenticated())

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

router.get("/setup/:id", checkAuthenticated, async (req, res) => {

  const id=req.params.id
  console.log('id', id)
  
  await Service.find({service_id:id},async(err,result)=>{
    if(err){
      throw new Error('Error in get data fro setup system')
    }

    if(result){

      res.status(200).json({place:result[0].place})
    }

  
  }).clone()
  .catch(function (err) {
    console.log(err)
  })

 
})

router.get("/setup", checkAuthenticated, async (req, res) => {
  let serviceSetupList=new Set([])

  console.log('req.user ', req.user.username)


  
// servicedb.collection("services").find({},{$or:[{owner:req.user.username},{keeper:req.user.username}]}).toArray(function(err,result){
//   console.log('result ', result)
// })



  await Service.find({owner:req.user.username},async(err,result)=>{
    if(err){
      throw new Error('Error in get data fro setup system')
    }

    if(result){
     
     for await(const r of result){
      const rObject = {
        place:r.place,
        service_id:r.service_id,
        topic:r.topic,
        status:r.status
      }

      serviceSetupList.add(rObject)




     }
    }
 res.status(200).json({service:[... new Set(serviceSetupList)]})
  }).clone()
  .catch(function (err) {
    console.log(err)
  })

 
})




router.post("/setup", checkAuthenticated, async (req, res) => {
 
})

module.exports = router
