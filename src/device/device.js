const express = require("express");
var router = express.Router();


const socket = require('../socket/socket')
const events = require('events');
const mongodb = require("../db/config/mongodb");
const deviceDB = mongodb.deviceDB;

const Device = require("../db/models/device");
const Service = require("../db/models/service");

const setup_data = require("../data/setup_data.json");



const checkAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
};

router.use(checkAuthenticated)


router.get("/device/:id", async (req, res) => {
  const serviceId = req.params.id;
  const userName = req.user.username;

 

  try {
    const serviceInfo = await Service.find({
      owner: userName,
      service_id: serviceId, // Use serviceId here
    }).clone().catch(function (err) {
      console.log(err);
    });

    if (serviceInfo && serviceInfo.length > 0) {
      const deviceResult = await Device.find({ service_id: serviceId }).clone().catch(function (err) {
        console.error('device finding procedure has a problem ', err);
      });

      

      if (deviceResult && deviceResult.length > 0) {

     
       const deviceInfo={
        devices: deviceResult[0].device,
        site: deviceResult[0].site

       }

       
        res.status(200).json(deviceInfo);
      } else {
        res.status(404).json({ message: "No device found" });
      }
    } else {
      res.status(404).json({ message: "No service found" });
    }
  } catch (error) {
    console.error("Error in device method", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


router.post("/device/sid", async (req, res) => {

  const serviceId = req.body.service_id;
  const userName = req.user.username;
  
  try {
   



    const serviceResult = await Service.find({
      owner: userName,
      service_id: serviceId,
    })
      .clone()
      .catch(function (err) {
        console.log(err);
      });

    if (serviceResult.length !== 0) {
      const deviceResult = await Device.find({ service_id: serviceId }).catch(
        function (err) {
          console.error('device finding procedure has problem ',err);
        }
      );

      if (deviceResult.length > 0) {

     

        //  console.log('deviceResult ', JSON.stringify(deviceResult[0].device));
      
        res.status(200).json({
          
          devices: deviceResult[0].device,
          site: deviceResult[0].site,
          
        });
      } else {
        res.status(404).json({ message: "No device found" });
      }
    } else {
       res.status(404).json({ message: "No service found" });
    }
  } catch (error) {
    console.error("Error in device method", error);
   res.status(500).json({ message: "Internal Server Error" });
  }


});

module.exports = router;
