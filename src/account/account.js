const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');


const checkAuthenticated = function (req, res, next) {
    console.log("req.isAuthenticated  in Dashbaord ", req.isAuthenticated())
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
  router.use(checkAuthenticated)

router.post("/account", checkAuthenticated, async (req, res) => {

   

    if((req.body.username)!==''){

        await Account.find({username:req.body.username},async(err,result)=>{
            if(err){
                throw new Error(err)
            }
    
    
            if(result.length!==0){
                if(result[0].verification){
                    res.status(200).json({
                        status:200,
                        msg:"ok"})
                }
               
            }else if(result.length===0){
                res.status(404).json({
                    status:404,
                    msg:"non exist"})
            }
        }).clone()
        .catch(function (err) {
          console.log(err)
        })
    

    }

   


})
    





 

 


module.exports = router;