const express = require("express");
var router = express.Router();
const socket = require('../socket/socket')
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


router.post("/device/sid", async (req, res) => {

let realTimeServiceId;
   
let io = socket.getIO(); // Access the socket.io instance

  const deviceNamespace = io.of("/device/sid");

  deviceNamespace.on('connection', (socket) => {
    // console.log('A user connected to /device/sid with socket id:', socket.id);

   socket.on("service_id", (data) => {
      // console.log(data); // Outputs: { dataKey: "Some data value" }
      
      handleRealTimeData(data);
     
      
    });

  

 

    socket.on("disconnect", () => {
      // console.log("Client disconnected");
      
    });
  });


  function handleRealTimeData(data) {
    // console.log('service_id in device ',data.dataKey)
   
  }

  

//  console.log('req ', req.body)

 

  try {
    const serviceId = req.body.service_id;
    const userName = req.user.username;



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
          console.log(err);
        }
      );

      if (deviceResult.length !== 0) {

     

         // Respond back to the client
         deviceNamespace.emit("/realtime/devices", {
          devices: deviceResult[0].device,
          site: deviceResult[0].site,
        })
      
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
