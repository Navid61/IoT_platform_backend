const express = require("express");

const router = express.Router();
const passport = require("passport")


// // User Filteration
const Control = require("../db/models/control");
// router.use(nocache)



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
  router.get("/control", checkAuthenticated, async (req, res) => {
 
})

  router.post("/control", checkAuthenticated, async (req, res) => {
 
  })



module.exports = router;