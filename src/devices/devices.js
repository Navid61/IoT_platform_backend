const express = require("express");
var router = express.Router();


const mongodb = require("../db/config/mongodb")
const deviceDB = mongodb.deviceDB


const Account= require('../db/models/account');
const Device = require('../db/models/device');
const Service = require('../db/models/service')




const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
  router.use(checkAuthenticated)



//   router.get("/devices", checkAuthenticated, async (req, res) => {

//     const service_id =req.body.id
    
    
//         // await Service.find({owner:req.user.username,service_id:service_id},async(err,result)=>{
//         //     if(err){
//         //         throw new Error('err in get owner name in device')
//         //     }
        
//         //     if(result.length!==0){
        
        
//         //         await Device.find({service_id:service_id},async(err,result)=>{
//         //             if(err){
//         //                 throw new Error(err)
//         //             }
        
//         //             if(result.length!==0){
    
                      
//         //                 const devicesList =result[0].device
//         //                 if(result[0].device){
//         //                     res.status(200).json({status:200,
//         //                         devices:devicesList})
//         //                 }
                      
//         //             }
        
//         //         }).clone()
//         // .catch(function (err) {
//         //   console.log(err)
//         // })
        
        
        
                   
        
                 
        
        
//         //                 // res.status(200).json({status:201,msg:"ok"})
                  
                        
                
                  
        
              
        
//         //     }else{
//         //         res.status(404).json({msg:"Devices Not Found"})
//         //     }
//         // }).clone()
//         // .catch(function (err) {
//         //   console.log(err)
//         // })
        
         
        
        
        
//         })
        


router.post("/devices", checkAuthenticated, async (req, res) => {

console.log('req.body ', req.body)




    await Service.find({owner:req.user.username,service_id:req.body.service_id},async(err,result)=>{
        if(err){
            throw new Error('err in get owner name in device')
        }
    
        if(result.length!==0){
    
    
            await Device.find({service_id:req.body.service_id},async(err,result)=>{
                if(err){
                    throw new Error(err)
                }
    
                if(result.length===0){
                   console.log('result in devices for no device location', result)
                    const newDeviceList = new Device({
                        service_id:req.body.service_id,
                        device:req.body.values
                    })
                    newDeviceList.save()
                     res.status(201).json({status:201,msg:"ok"})
                }else if(result.length!==0){
    
                    if(result[0].device.length !==0){
                        console.log('result in devices ', result)
                   
                        try{
                           await deviceDB.collection("devices").findOneAndUpdate({service_id:req.body.service_id},{$set:{device:req.body.values}})
                            res.status(204).json({status:204,msg:"updated"})
                        }catch(e){
                            res.status(400).json({status:400,msg:e})
                        }
                    }
    
                   
                   
                    
                }
    
            }).clone()
    .catch(function (err) {
      console.log(err)
    })
    
    
    
               
    
             
    
    
                   
              
                    
            
              
    
          
    
        }else{
            res.status(401).json({msg:'Error Service Not found'})
        }
    }).clone()
    .catch(function (err) {
      console.log(err)
    })
    




 



})








module.exports = router;