const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB


const checkAuthenticated = function (req, res, next) {
    console.log("req.isAuthenticated  in Dashbaord ", req.isAuthenticated())
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)

router.post("/users", checkAuthenticated, async (req, res) => {

    if(req.body.task===205){
        await Account.find({username:req.body.username},async(err,result)=>{
            if(err){
                throw new Error(err)
            }
    
    
            if(result.length!==0){
          
                if(result[0].username===req.body.username && result[0].verification === true){

                    

                    checkDuplicateServiceID()
                    
                    
                }
               
            }
        }).clone()
        .catch(function (err) {
          console.log(err)
        })


        async function checkDuplicateServiceID(){
            await Users.find({username:req.body.username},async(err,result)=>{

                if(err){
                    throw new Error(err)
                }

                if(result.length!==0){
                    if(result[0].service_id!==req.body.service_id){
                     
                        res.status(200).json({msg:"ok"})
                    }else{
                        res.status(409).json({msg:'Conflict'})
                    }

                }else if(result.length===0){

                    res.status(200).json({msg:"ok"})

                }

            }).clone()
            .catch(function (err) {
              console.log(err)
            })

        }
    

    }

    if(req.body.task===201){

    // console.log('no new user create new user')

    

        await Service.find({owner:req.body.username},async(err,result)=>{
            if(err){
                throw new Error('error in check user exist as a owner before create new user')
            }
    
   
                if(result.length ===0){
             
                        await Users.find({username:req.body.username,service_id:req.body.service_id},async(err,result)=>{
                            if(err){
                                throw new Error('error in users find before create new user')
                            }

                            if(result.length===0){
                                if(req.body.role ==='admin'){
                                    const createNewUser = new Users({
                                        username:req.body.username,
                                        service_id:req.body.service_id,
                                        role:"admin",
                                        adddate:new Date().toISOString()
                            
                                    })
                            
                                    async function makenewuser(){
                                        await createNewUser.save()
                                    }
                            
                                    makenewuser().then(()=>{
                                        res.status(200).json({msg:"ok"})
                                    })
                            
                                }else if(req.body.role===''|| req.body.role!=='admin'){
                            
                                    const createNewUser = new Users({
                                        username:req.body.username,
                                        service_id:req.body.service_id,
                                        role:"user",
                                        adddate:new Date().toISOString()
                            
                                    })
                            
                                    async function makenewuser(){
                                        await createNewUser.save()
                            
                                       
                                    }
                            
                                    makenewuser().then(()=>{
                                        res.status(200).json({msg:"ok"})
                                    })
                                   
                                }

                            }else if(result.length!==0){
                                res.status(409).json({msg:"Confilict! user created already"})
                            }

                        }).clone().catch(function (err) {console.log(err)})
                
  
                   
    
                }else{
                    res.status(403).json({msg:"Forbiden user"})
                }
           
        }).clone().catch(function (err) {console.log(err)})
    


  

      

    }


    if(req.body.task==='remove'){
const removeUsersList =req.body.users

const service_id = req.body.service_id


let result =[]

let newResultList =[]

if(removeUsersList.length > 0){
    for(let i=0;i<removeUsersList.length;i++){

        (async(i)=>{
       await Users.find({username:removeUsersList[i].user,service_id:req.body.service_id},async(err,result)=>{

                if(err){
                    throw new Error('error in get remove users list')
                }
    
                if(result.length!==0){
                    for(let j =0 ; j<result.length;j++){

                        // console.log('result[j]', result[j])
    
                     
                          (async(j)=>{
                            await usersDB.collection("users").deleteOne({username:result[j].username,service_id:result[j].service_id})
                          })(j)
                    
                        
                           
                        
                       }
    
                }
    
          
    
               
            
            }).clone().catch(function (err) {console.log(err)})
    
        })(i)
           
        
    }

    res.status(200).json({msg:'done'})
   
}









  

    }

  

   

    


})


router.get("/users/:id", checkAuthenticated, async (req, res) => {
    const _id=req.params.id

    let usersList =[]

   await Users.find({service_id:_id},async(err,result)=>{

    if(err){
        throw new Error(err)
    }

    if(result.length!==0){
       for(let i=0;i<result.length;i++){
        usersList.push({"user":result[i].username,"role":result[i].role})

       }
    }

    if(usersList.length!==0){
        res.status(200).json({users:[...new Set(usersList)]})
    }

    }).clone()
        .catch(function (err) {
          console.log(err)
        })

 })
    





 

 


module.exports = router;