const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');


const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB

const UserGroup= require('../db/models/usergroup')


const checkAuthenticated = function (req, res, next) {
   
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)

router.post("/usergroup", checkAuthenticated, async (req, res) => {


   

   const newUserGroup=req.body.group
    const service_id=req.body.service_id

   
  
await UserGroup.find({service_id:service_id}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length ===0){
        console.log('newUserGroup ', newUserGroup, 'service_id ', service_id)
        /// THIS IS ONLY FOR FIRST TIME
       const createNewUserGroup = new UserGroup({
        service_id:service_id,
        group:newUserGroup
       })

       createNewUserGroup.save()
       res.status(200).json({msg:"created"})
    }else{

        const uGroup = result[0].group

        let checkGroupName=[]

        for(let g=0;g<uGroup.length;g++){
            checkGroupName.push(uGroup[g].group)
        }
    
        
    let existGroup=[... new Set(checkGroupName)]

   



      

        for(let k=0;k<newUserGroup.length;k++){
            if(!existGroup.includes(newUserGroup[k].group)){
                usersDB.collection("usergroups").updateOne({service_id:service_id},{$push:{group:newUserGroup[k]}})
            }
            
           
        }


     res.status(200).json({msg:"created"})
    }
}).clone().catch(function (err) {console.log(err)})

   

})

 





 

 


module.exports = router;