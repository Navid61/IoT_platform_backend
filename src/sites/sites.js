const express = require("express")
var router = express.Router()

const mongodb = require("../db/config/mongodb")
const deviceDB = mongodb.deviceDB

const Device = require("../db/models/device")
const Service = require("../db/models/service")


const setup_data=require("../data/setup_data.json")
const { log } = require("console")

const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
}

router.use(checkAuthenticated)



router.post("/sites/create", checkAuthenticated, async (req, res) => {

    const service_id = req.body.service_id;
    const values = req.body.values;
    const deviceCoordinate = req.body.pos ?? [];

    let updateDeviceSite;
   
   console.log('req.body.pos', deviceCoordinate)
// Step 1 check service exist for that owner in Service database
 await Service.find(
  { owner: req.user.username, service_id: service_id },
  async (err, result) => {
    if (err) {
      throw new Error("err in get owner name in device")
    }

    if (result.length > 0) {

      // It means it found service  a service

      try {
        await Device.find({ service_id: service_id }, async (err, result) => {
          if (err) {
            throw new Error(err)
          }
  
          const existDeviceList = result[0].device
  
        //  console.log('existDeviceList ', existDeviceList);
  
        console.log('values ', values)
       
        
        if (existDeviceList && existDeviceList.length > 0) {
          if(deviceCoordinate && deviceCoordinate.length ===0 && values && values.length > 0){
            updateDeviceSite = existDeviceList.map((elm) => {
              const existObjIndex = values.findIndex((item) => item.device === elm.device);
    
              // console.log('existOnjext ', existObjIndex);
    
              if (existObjIndex !== -1 && elm.device === values[existObjIndex]?.device) {
                elm.site = values[existObjIndex]?.site;
              }
    
              return elm;
            });
          }else{
            updateDeviceSite = existDeviceList.map((elm) => {
              const existObjIndex = values.findIndex((item) => item.device === elm.device);

              const existCoordinate = deviceCoordinate.findIndex((coord)=>coord.deviceId === elm.device)
    
               console.log('existCoordinate ', existCoordinate);
    
              if (existCoordinate !== -1 && elm.device === deviceCoordinate[existCoordinate]?.deviceId && existObjIndex !== -1 && elm.device === values[existObjIndex]?.device) {
                elm.site = values[existObjIndex]?.site;
                elm.longitude = deviceCoordinate[existCoordinate]?.longitude,
                elm.latitude = deviceCoordinate[existCoordinate]?.latitude
              }else if(existCoordinate === -1 && existObjIndex !== -1 && elm.device === values[existObjIndex]?.device){
                elm.site = values[existObjIndex]?.site;
              }
    
              return elm;
            });

          }
    
      
        
        }
          
  
        
          
         
        })
          .clone()
          .catch(function (err) {
            console.log(err)
          })
      } catch (error) {
        console.error('error not found any device ', error)
      }
    

       
        // console.log('updateDeviceSite ', updateDeviceSite);

if(updateDeviceSite){

  try {
    await deviceDB
    .collection("devices")
    .updateOne({ service_id: service_id}, {$set:{device:updateDeviceSite}})  
    .then(()=>{
      res.status(201).json({ status: 201, msg: "ok" })
     })
  } catch (error) {
    console.error('device list updating ', error);
  }
 
}
     
        
          
       

      
    } else {
      res.status(401).json({ msg: "Error Device Not found" })
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

    // const deviceCoordinate = req.body.pos ?? [];
    // let updateDeviceSite;
   
  console.log('values in update' , values);
      await Service.find(
        { owner: req.user.username, service_id: service_id },
        async (err, result) => {
          if (err) {
            throw new Error("err in get owner name in device")
          }
  
          if (result && result.length >0) {
            await Device.find({ service_id: service_id }, async (err, result) => {
              if (err) {
                throw new Error(err)
              }
  

              const existDeviceList = result[0].device
              if (existDeviceList && existDeviceList.length>0) {
                console.log('existDeviceList ', existDeviceList);
                // try {

                //   await deviceDB
                //   .collection("devices")
                //   .updateOne({ service_id: service_id}, {$set:{device:values}})  
                //   .then(()=>{
                //     res.status(204).json({ status: 204, msg: "updated" })
                //    })
                //   // await deviceDB
                //   //   .collection("devices")
                //   //   .findOneAndUpdate(
                //   //     { service_id: service_id },
                //   //     { $set: { device: values } }
                //   //   )
                //   // res.status(204).json({ status: 204, msg: "updated" })
                // } catch (e) {
                //   res.status(400).json({ status: 400, msg: e })
                // }
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