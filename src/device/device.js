const express = require("express")
var router = express.Router()

const mongodb = require("../db/config/mongodb")
const deviceDB = mongodb.deviceDB

const Device = require("../db/models/device")
const Service = require("../db/models/service")


const setup_data=require("../data/setup_data.json")

const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
}

router.use(checkAuthenticated)

router.get("/device/:id", checkAuthenticated, async (req, res) => {
  const service_id = req.params.id
  console.log('service_id ', service_id)
    await Service.find(
      { owner: req.user.username,service_id:service_id},
      async (err, result) => {
        if (err) {
          throw new Error("Error in get data for setup system")
        }
  
        if (result.length !== 0) {

          console.log('result ', result)

          await Device.find({service_id:service_id}, async (err, result) => {
            if (err) {
              throw new Error(err)
            }
      
            if (result.length !== 0) {
      
           
           
        
                res
                  .status(200)
                  .json({
                   
                    setup:setup_data,
                    devices: result[0].device,
                    place: result[0].place,
                  })
             
            }else{
              res.status(200).json({
                setup:setup_data
              })
            }
          })
            .clone()
            .catch(function (err) {
              console.log(err)
            })

        
         
        }
      }
    )
      .clone()
      .catch(function (err) {
        console.log(err)
      })



  
  })
  













module.exports = router
