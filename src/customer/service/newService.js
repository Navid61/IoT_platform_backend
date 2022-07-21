const express = require("express")
const router = express.Router()
const colors = require("colors")
const axios = require("axios")

const mongodb = require("../../db/config/mongodb")
// const serviceDB = mongodb.serviceDB
const agentDB= mongodb.agentDB

const Service = require("../../db/models/service")
const Control = require("../../db/models/control")

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

router.get("/service", checkAuthenticated, async (req, res) => {


  try{

    await Control.find({username:req.user.username}, async(err,result)=>{

      if(err){
        throw new Error('Error in detect system users')
      }
    
       if(result.length !== 0){
       
          if(result[0].username===req.user.username){
            await Service.find({}, async (err, result) => {
              if (err) {
                throw new Error("get customer list ans service failed")
              }
          
              if (result.length > 0) {
              
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
        }
    
     
    }).clone().catch(function (err) {
                console.log(err)
              })

  }catch(e){

    console.error('error ', e)

  }



   


 
})

router.post("/service", checkAuthenticated, async (req, res) => {
  // let topic = "topic-" + makeid(16)
  let topic = req.body.topic
  let service_id= 'id-'+makeid(25)

  // console.log("service", topic)

  // console.log("req.body ", req.body)
  const owner = req.body.owner

  if (req.body.task === "create" && owner.length > 0) {
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

       newService.save()
       res.status(200).json({
        status:200,
        msg:'new service created successfully'
      })
    }
  } else if (req.body.task === "remove") {
  }
})

module.exports = router
