const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');
const Service=require('../db/models/service')

const checkAuthenticated = function (req, res, next) {
    // console.log("req.isAuthenticated  in Account Router ", req.isAuthenticated())
  
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
                        user:result[0].username,
                        role:result[0].role,
                        status:200,
                        msg:"ok"})
                }else{

                    res.status(404).json({
                   
                        status:404,
                        msg:"user is not verified!"})

                }
               
            }else if(result.length===0){
                res.status(404).json({
                   
                    status:404,
                    msg:`${req.body.username} is not registered`})
            }
        }).clone()
        .catch(function (err) {
          console.log(err)
        })
    

    }

   


})
    

router.get("/account", checkAuthenticated, async (req, res) => {

  

        await Account.find({username:req.user.username},async(err,result)=>{
            if(err){
                throw new Error(err)
            }
    
    
            if(result.length!==0){
               
                if(result[0].verification){

                    await Service.find({})

                    

                    res.status(200).json({
                        user:result[0].username,
                        role:result[0].role,
                        auth:req.isAuthenticated(),
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
    

  

   


})
    



 

 


module.exports = router;