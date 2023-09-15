const express = require("express");
var router = express.Router();

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

router.use(checkAuthenticated);

router.post("/device/id", async (req, res) => {
  const service_id = req.body._id;
  const userName = req.user.username;

  // console.log('service_id in device ', service_id)

  try {
    const serviceId = req.body._id;
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
        return res.status(200).json({
          devices: deviceResult[0].device,
          site: deviceResult[0].site,
        });
      } else {
        return res.status(404).json({ message: "No device found" });
      }
    } else {
      return res.status(404).json({ message: "No service found" });
    }
  } catch (error) {
    console.error("Error in device method", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  //   try {
  //     await Service.find(
  //       { owner: userName,service_id:service_id},
  //       async (err, result) => {

  //         if (err) {
  //           throw new Error("Error in get data for setup system")
  //         }

  //         if (result.length !== 0) {

  //           await Device.find({service_id:service_id}, async (err, result) => {
  //             if (err) {
  //               throw new Error(err)
  //             }

  //             if (result.length !== 0) {

  // console.log('result ', result[0].device)

  //                 res
  //                   .status(200)
  //                   .json({

  //                     devices: result[0].device,
  //                     site: result[0].site
  //                   })

  //             }
  //           })
  //             .clone()
  //             .catch(function (err) {
  //               console.log(err)
  //             })

  //         }
  //       }
  //     )
  //       .clone()
  //       .catch(function (err) {
  //         console.log(err)
  //       })

  //   } catch (error) {
  //     console.error('error in device method ', error)
  //   }
});

module.exports = router;
