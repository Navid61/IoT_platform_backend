const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');
const mqtt = require('mqtt')
const axios =require('axios');

const getFilterData = require("../data/getData");
const getInfo = getFilterData.getData
const Access = require("../db/models/access");

const Users= require("../db/models/users");
const UserGroup=require("../db/models/usergroup");

const mongodb = require("../db/config/mongodb");
const filterBoardDB = mongodb.filterBoardDB;

const usersDB = mongodb.usersDB;

const FilterRule = require('../db/models/filter')

const Account = require("../db/models/account");

// CHECK USER AUTHENTICATION FOR LOGIN
var checkAuthenticated = function (req, res, next){
  // console.log('req.isAuthenticated is ', req.isAuthenticated())
    if (req.isAuthenticated())
     {
        return next()
    }
  }

router.use(checkAuthenticated);

const db="cyprus-dev"
const zone ="office"



router.get('/filter/:id',checkAuthenticated,async(req,res)=>{
  let userNameList=[]
 const service_id = req.params.id



  await UserGroup.find({service_id:service_id}, async(err,result)=>{
    if(err){
      throw new Error(err)
    }

   

    if(result.length===0|| result[0].group.length ===0){
      // WHEN THERE IS NOT ANY USER GROUOP
      await Users.find({service_id:service_id},async(err,result)=>{
        if(err){
          throw new Error(err)
        }
    
        if(result.length > 0){
         for(let i=0;i<result.length;i++){
          userNameList.push({username:result[i].username})
         }

     

          await FilterRule.find({service_id:service_id},async(err, result)=>{
            if(err){
              throw new Error(err)
            }

            if(result){
              if(result.length!==0){
                res.status(200).json({username:userNameList,filters:result[0].rule})

              }else{
                res.status(200).json({username:userNameList})
              }

            }
          }).clone().catch(function(err){ console.log(err)});

      
        
        
        }
      }).clone().catch(function(err){ console.log(err)});
    
      
    }else{

     
      const userNameGroup=result[0].group
   
      let userNameInGroup=[]
      let groupName=[]
 
     
      for(let i=0;i<userNameGroup.length;i++){
        userNameInGroup.push(userNameGroup[i].user)
        groupName.push(userNameGroup[i].group)
      }

      const usersList= [...new Set(userNameInGroup)]
      const groupNameList =[...new Set(groupName)]

     


      await Users.find({service_id:service_id},async(err,result)=>{
        if(err){
          throw new Error(err)
        }
    
        if(result.length > 0){
         for(let i=0;i<result.length;i++){
          userNameList.push({username:result[i].username})
         }

        }
 

        const filteredUserNameList= userNameList.filter(item=>{
          if(usersList.includes(item.username)){
            return ''
          }else{
            return item
          }
         })

     

          await FilterRule.find({service_id:service_id},async(err, result)=>{
            if(err){
              throw new Error(err)
            }

            if(result){
              if(result.length!==0){
                res.status(200).json({username:filteredUserNameList,group:groupNameList,usergroup:userNameGroup,filters:result[0].rule})
               

              }else{
                res.status(200).json({username:filteredUserNameList,group:groupNameList,usergroup:userNameGroup})
              }

            }
          }).clone().catch(function(err){ console.log(err)});

      

        


         

         




       
      }).clone().catch(function(err){ console.log(err)});

    }

   }).clone().catch(function(err){ console.log(err)});



 





})

router.post('/filter/removeusergroup',checkAuthenticated,async(req,res)=>{


const service_id=req.body.service_id
const removeList=req.body.remove

const listOfRemoveGroup=[]

if(service_id.length > 0  && removeList.length!==0){

 
   
     await UserGroup.find({service_id:service_id},async(err,result)=>{
        if(err){
          throw new Error(err)
        }
  
  
        if(result.length > 0){
  
         const groupName = result[0].group

       
        for await (const i of groupName){
          if(removeList.includes(i.group)){

          

            usersDB.collection('usergroups').updateOne({service_id:service_id},{$pull:{group:{group:i.group}}})
            
            
          }
        }

        res.status(200).json({msg:"removed Successfully"})
  
  
        }
      }).clone().catch(function(err){ console.log(err)});

 
    
 
  
}
})

router.post('/filter/modifyusergroup',checkAuthenticated,async(req,res)=>{

 

  const service_id = req.body.service_id;
  const modifyList= req.body.modify

  

 
if(req.body.cmd==='add'){

  await UserGroup.find({service_id:service_id},async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    if(result){
      const groupMember = result[0].group

      for(let j=0;j<modifyList.length;j++){
      await usersDB.collection('usergroups').updateOne({service_id:service_id}, {$push:{group:modifyList[j]}})
      }
      res.status(200).json({msg:"modification is done"})

     
   


    


    }

  }).clone().catch(function(err){ console.log(err)});


}else if(req.body.cmd==='remove'){
  for(let j=0;j<modifyList.length;j++){

    console.log('modifyList ', modifyList[j])
    await usersDB.collection('usergroups').updateOne({service_id:service_id}, {$pull:{group:{group:modifyList[j].group,user:modifyList[j].user}}})
    }
    res.status(200).json({msg:"modification is done"})
}


 
  

  
})




router.post('/filter/content',checkAuthenticated,async(req,res)=>{
  const service_id=req.body.service_id;
  const groupName=req.body.name

  await UserGroup.find({service_id:service_id},async(err, result)=>{
    if(err){
      throw new Error(err)
    }

    if(result.length > 0){
      const group= result[0].group
      const users=[]
      for(let i=0;i<group.length;i++){
        if(group[i].group ===groupName){
          users.push(group[i].user)

        }

      }

      const gUsers = [...new Set(users)]
      res.status(200).json({users:gUsers})
       
      
    }

  }).clone().catch(function(err){ console.log(err)});



  })



router.post('/filter/newfilter',checkAuthenticated,async(req,res)=>{

const service_id = req.body.service_id
const rule=req.body.rule




await FilterRule.find({service_id:service_id},async(err,result)=>{
  if(err){
    throw new Error(err)
  }


  if(result){
    if(result.length!==0){
    

      if(result[0].rule.length===0){
        (async()=>{
         return await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$push:{rule:rule}})
        })().then((response)=>{
          if(response){
            res.status(201).json({msg:"rule added successfully"})
          }
        })

      }else{

        // CHECK RULE EXIST OR NOT
        (async()=>{
          await FilterRule.find({service_id:service_id,rule:{$elemMatch:{sensors:rule.sensors,users:rule.users}}},async(err,result)=>{
            if(err){
              throw new Error(err)
            }
            if(result){
              if(result.length!==0){

              // IF RULE WAS EXIST

                res.status(409).json({msg:"Duplicate Rule!, this rule exist already,please UPDATE exist rule"})

              }else{

                // IF RULE IT WAS NOT EXIST

                (async()=>{
                  return await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$push:{rule:rule}})
                })().then((response)=>{
                  if(response){
                    res.status(201).json({msg:"this rule add successfully"})
                  }
                })

              }
            }
          }).clone().catch(function(err){ console.log(err)});

        })()
        

      }

    }else{

      (async()=>{
       return await filterBoardDB.collection("filterrules").insertOne({service_id:service_id,rule:[rule]})
      })().then((response)=>{
        if(response){
          res.status(201).json({msg:"rule added successfully"})
        }
      })
     
     
      

    }

  }



}).clone().catch(function(err){ console.log(err)});

  
  
 
 
})


router.post('/filter/updaterule',checkAuthenticated,async(req,res)=>{

  const service_id = req.body.service_id
  const rule=req.body.update
  
  
 
  
  await FilterRule.find({service_id:service_id},async(err,result)=>{
    if(err){
      throw new Error(err)
    }
  
  
    if(result){
      if(result.length!==0){


        (async()=>{
          return await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$set:{rule:rule}})
        })().then((response)=>{
          if(response){
            res.status(200).json({msg:"rule updated successfully"})
          }
        })
  
        
  
      }
  
    }
  
  
  
  }).clone().catch(function(err){ console.log(err)});
  
    
    
   
   
  })


  router.delete('/filter/removerule',checkAuthenticated,async(req,res)=>{
    const service_id=req.body.service_id
    const removeList = req.body.remove
   

    await FilterRule.find({service_id:service_id}, async(err,result)=>{
      if(err){
        throw new Error(err)
      }

      if(result){
        (async()=>{
          for(let i=0;i<removeList.length;i++){
           
            await filterBoardDB.collection("filterrules").updateOne({service_id:service_id},{$pull:{rule:removeList[i]}})
          }
          

        })().then(()=>{
          res.status(200).json({msg:"Rules Remove Successfully"})
        }).catch(e=>{
          res.status(204).json({msg:"No Content"})
        })
       
      }
    }).clone().catch(function(err){ console.log(err)});
  })
  

module.exports=router