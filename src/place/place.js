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
            
                        console.log('ressult in place for users', result)
            
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

                                    console.log('placeName ', placeName)
            
                                    if(result.length===placeName.length){
                                        res.status(200).json({
                                            status:200,
                                            place:placeName
                            
                                        })
                                    }
            
            
            
            
            
                                }
            
                            }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })
                        }
            
                        
            
                    }
            
            
                
            
                }).clone()
                    .catch(function (err) {
                      console.log(err)
                    })

            }else {

                await Service.find({owner:req.user.username},async(err,result)=>{
                    if(err){
                        throw new Error(err)
                    }
    
                    if(result.length!==0){

                        // console.log('result for owner account ', result)
    
                        for(let m=0;m<result.length;m++){
                            ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})
    
                        }
                        // console.log('ownerPlaceList ', ownerPlaceList)
    
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
        }

    }).clone().catch(function (err) {console.log(err)})
    


})

    





 

 


module.exports = router;