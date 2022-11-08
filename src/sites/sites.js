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



router.post("/sites/create", checkAuthenticated, async (req, res) => {

    const service_id = req.body.service_id
    const values = req.body.values

 
   
     await Service.find(
        { owner: req.user.username, service_id: service_id },
        async (err, result) => {
          if (err) {
            throw new Error("err in get owner name in device")
          }
  
          if (result.length !== 0) {
            await Device.find({ service_id: service_id }, async (err, result) => {
              if (err) {
                throw new Error(err)
              }
  
              if (result.length === 0) {
                ;(async () => {
                  return await deviceDB
                    .collection("devices")
                    .insertOne({ service_id: service_id, device: values })
                })().then((response) => {
                  if (response) {
                    res.status(201).json({ status: 201, msg: "ok" })
                  }
                })
              }else {
               (async()=>{
                await deviceDB
                    .collection("devices")
                    .updateOne({ service_id: service_id}, {$set:{device:values}})

               })().then(()=>{
                res.status(201).json({ status: 201, msg: "ok" })
               })
              }
            
            })
              .clone()
              .catch(function (err) {
                console.log(err)
              })
          } else {
            res.status(401).json({ msg: "Error Service Not found" })
          }
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err)
        })
  
   
  })
  


router.post("/sites/update", checkAuthenticated, async (req, res) => {
    const service_id = req.body.service_id
    const values = req.body.values

   
  
      await Service.find(
        { owner: req.user.username, service_id: service_id },
        async (err, result) => {
          if (err) {
            throw new Error("err in get owner name in device")
          }
  
          if (result.length !== 0) {
            await Device.find({ service_id: service_id }, async (err, result) => {
              if (err) {
                throw new Error(err)
              }
  
              if (result.length !== 0) {
                if (result[0].device.length !== 0) {
                  console.log("result in devices ", result)
  
                  try {
                    await deviceDB
                      .collection("devices")
                      .findOneAndUpdate(
                        { service_id: service_id },
                        { $set: { device: values } }
                      )
                    res.status(204).json({ status: 204, msg: "updated" })
                  } catch (e) {
                    res.status(400).json({ status: 400, msg: e })
                  }
                }
              }
            })
              .clone()
              .catch(function (err) {
                console.log(err)
              })
          } else {
            res.status(404).json({ msg: "Devices Not Found" })
          }
        }
      )
        .clone()
        .catch(function (err) {
          console.log(err)
        })
  })
  


module.exports = router