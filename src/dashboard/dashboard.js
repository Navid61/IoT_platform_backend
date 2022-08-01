const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');

const axios =require('axios');


const checkAuthenticated = function (req, res, next){

//    console.log('req.isAuthenticated  in Dashbaord ', req.isAuthenticated())
   
      if (req.isAuthenticated())
       {
          return next()
      }
     
    }
  
router.use(checkAuthenticated);

router.get('/dashboard',checkAuthenticated,async(req,res)=>{

 console.log('Dashboard ', dashbaord)



})

router.post('/dashboard',checkAuthenticated,async(req,res)=>{
    console.log('Dashboard ', dashbaord)

})


module.exports = router