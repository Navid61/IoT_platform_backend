const express = require("express");

const router = express.Router();
const passport = require("passport")


// // User Filteration
const Client = require("../db/models/client");
// router.use(nocache)



const checkAuthenticated = function (req, res, next) {
    // console.log("req.isAuthenticated  in New Client Router ", req.isAuthenticated())
  
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
  router.get("/client", checkAuthenticated, async (req, res) => {
 
})

  router.post("/client", checkAuthenticated, async (req, res) => {
 
  })



module.exports = router;