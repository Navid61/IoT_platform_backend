// const express = require("express")
// const router = express.Router()
// const colors = require("colors")
// const axios = require("axios")

// const mongodb = require("../db/config/mongodb")
// const servicedb = mongodb.serviceDB
// const agentDB= mongodb.agentDB

// const Service = require("../db/models/service")
// const Control = require("../db/models/control")
// const Device = require("../db/models/device")

// const checkAuthenticated = function (req, res, next) {
 

//   if (req.isAuthenticated()) {
//     return next()
//   }
// }

// router.use(checkAuthenticated)

// ///////////

// function makeid(length) {
//   var result = ""
//   var characters = "abcdefghijklmnopqrstuvwxyz0123456789"
//   var charactersLength = characters.length
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result
// }

// ////////



// router.get("/setup", checkAuthenticated, async (req, res) => {
//   let serviceSetupList=new Set([])

//   console.log('req.user ', req.user.username)


  



//   await Service.find({owner:req.user.username},async(err,result)=>{
//     if(err){
//       throw new Error('Error in get data fro setup system')
//     }

//     if(result){
//     //  console.log('result in ', result)
//      for await(const r of result){
//       const rObject = {
//         place:r.place,
//         service_id:r.service_id,
//         topic:r.topic,
//         status:r.status
//       }

//       serviceSetupList.add(rObject)




//      }
//     }
//  res.status(200).json({service:[... new Set(serviceSetupList)]})
//   }).clone()
//   .catch(function (err) {
//     console.log(err)
//   })

 
// })




// router.get("/setup/:id", checkAuthenticated, async (req, res) => {

//   const _id=req.params.id

//   // console.log('req.user-----> ', req.user.username)
//  console.log('req.params ', req.params)
//  console.log('id ', _id)
// if(_id!==undefined||_id!==''){
//   try{
//     await Service.find({owner:req.user.username,service_id:_id},async(err,result)=>{
//       if(err){
//         throw new Error('Error in get data for setup system')
//       }
  
//       if(result.length!==0){

//         await Device.find({service_id:_id},async(err,result)=>{
//           if(err){
//               throw new Error(err)
//           }

//           if(result.length!==0){

            
//               const devicesList =result[0].device
//               if(result[0].length !==0){
//                   res.status(200).json({status:200,
//                       devices:devicesList,
//                       place:result[0].place
//                     })
//               }
            
//           }

//       }).clone()
// .catch(function (err) {
// console.log(err)
// })

     
  
        
//       }
  
    
//     }).clone()
//     .catch(function (err) {
//       console.log(err)
//     })
//   }catch(e){
// console.error('e', e.response)
//   }
  
// }

  

 
// })







// module.exports = router
