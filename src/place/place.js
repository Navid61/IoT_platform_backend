const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)




router.get("/place", checkAuthenticated, async (req, res) => {
    let serviceList = []
    let placeName=[]

    let ownerPlaceList =[]

    let notOwnerServices =[]
let notOwnerServicesList=[]
    await Account.find({username:req.user.username},async(err,result)=>{
        if(err){
            throw new Error(err)
        }

        if(result.length!==0){
            
            if(result[0].role!=='owner'){
                await Users.find({username:req.user.username},async(err,result)=>{

                    if(err){
                        throw new Error(err)
                    }
            
                    if(result.length!==0){
            
                     
            
                        for (let i=0;i<result.length;i++){
            
                            serviceList.push(result[i].service_id)
                            
                        }
            
                     
            
                        for (let j=0;j<serviceList.length;j++){
                           await Service.find({service_id:serviceList[j]},async(err,result)=>{
                                if(err){
                                    throw new Error(err)
                                }
            
                                if(result.length!==0){
                                    for (let k=0;k<result.length;k++){
                                        placeName.push({name:result[k].place,service_id:serviceList[j]})
                                    }

                               
                 
                          
            
            
            
            
                                }
            
                            }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })
                        }

                      

                       
                            res.status(200).json({
                                status:200,
                                place:placeName
                
                            })
                        

            
                        
            
                    }
            
            
                
            
                }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })

            }else {


                await Users.find({username:req.user.username},async(err,result)=>{

                    if(err){
                        throw new Error(err)
                    }
            
                    if(result.length!==0){

                        console.log('result ', result)

                        for(let i=0;i<result.length;i++){
                            notOwnerServices.push(result[i].service_id)
                        }

                        if(notOwnerServices){

                            console.log(' notOwnerServices ',  notOwnerServices)
                            for(let i=0;i<notOwnerServices.length;i++){
                                await Service.find({service_id:notOwnerServices[i]},async(err,result)=>{
                                    if(err){
                                        throw new Error(err)
                                    }
    
                                    if(result.length!==0){
    
                                        for(let i=0;i<result.length;i++){
                                            notOwnerServicesList.push({name:result[i].place,service_id:result[i].service_id})
                                        }
    
                                       
    
                                       
    
                                        
    
                                    }
    
                                }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })
                            }

                            console.log('notOwnerServicesList ', notOwnerServicesList)

                            if(notOwnerServicesList){

                               
                                await Service.find({owner:req.user.username},async(err,result)=>{
                                    if(err){
                                        throw new Error(err)
                                    }
                    
                                    if(result.length!==0){
                
                                       
                                     
                    
                                        for(let m=0;m<result.length;m++){
                                            ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})
                    
                                        }
                                        console.log('ownerPlaceList===> ', ownerPlaceList)
                  
                                        console.log('notOwnerServicesList ', notOwnerServicesList)

                                        const entireServices = ownerPlaceList.concat(notOwnerServicesList)
                                        
                                            res.status(200).json({
                                                status:200,
                                                place:entireServices
                                
                                            })
                             
                    
                    
                    
                    
                    
                                    }
                    
                                }).clone()
                        .catch(function (err) {
                          console.log(err)
                        })
                               
                            }
                        }

                        
                        
                    }else{

                        await Service.find({owner:req.user.username},async(err,result)=>{
                            if(err){
                                throw new Error(err)
                            }
            
                            if(result.length!==0){
        
                               
                             
            
                                for(let m=0;m<result.length;m++){
                                    ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})
            
                                }
                                console.log('ownerPlaceList ', ownerPlaceList)
          
            
                                if(result.length===ownerPlaceList.length){
                                    res.status(200).json({
                                        status:200,
                                        place:ownerPlaceList
                        
                                    })
                                }
            
            
            
            
            
                            }
            
                        }).clone()
                .catch(function (err) {
                  console.log(err)
                })

                    }

                 

               

                }).clone()
                .catch(function (err) {
                  console.log(err)
                })

          
               
            }
        }

    }).clone().catch(function (err) {console.log(err)})
    


})

router.get("/place/:id", checkAuthenticated, async (req, res) => {

    const service_id = req.params.id

  console.log('service_id place ', service_id)

    await Users.find({username:req.user.username,service_id:service_id},async(err,result)=>{

        if(err){
            throw new Error(err)
        }

        if(result.length!==0){

       
const rIndex = result.findIndex(item=>item.service_id===service_id)

console.log('rIndex ', rIndex)
   if(rIndex!== -1){
 
     res.status(200).json({
                    status:200,
                    role:result[rIndex].role
    
                })
   
   }

          

         

         
          

           
               


            

        }else if(result.length===0) {

            await Service.find({owner:req.user.username,service_id:service_id}, async (err, result) => {
                if (err) {
                  throw new Error("get customer list and service failed")
                }
            
                if (result.length !==0) {
            
                    res.status(200).json({
                        status:200,
                        role:result[0].role
        
                    })
                }
              })
                .clone()
                .catch(function (err) {
                  console.log(err)
                })

        }


    

    }).clone()
        .catch(function (err) {
          console.log(err)
        })

})

    





 

 


module.exports = router;