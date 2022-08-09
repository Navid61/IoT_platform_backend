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

const UserFilter = require('../db/models/filter')

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

if(service_id){

  await UserGroup.find({service_id:service_id}, async(err,result)=>{
    if(err){
      throw new Error(err)
    }

    let userNameList=[]

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
        
         res.status(200).json({username:userNameList})
        }
      }).clone().catch(function(err){ console.log(err)});
    
      
    }else{

     
      const userNameGroup=result[0].group
    // console.log('userNameGroup ', userNameGroup)
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


 

        const filteredUserNameList= userNameList.filter(item=>{
          if(usersList.includes(item.username)){
            return ''
          }else{
            return item
          }
         })

        


         

         res.status(200).json({username:filteredUserNameList,group:groupNameList,usergroup:userNameGroup})




        }
      }).clone().catch(function(err){ console.log(err)});

    }

   }).clone().catch(function(err){ console.log(err)});


}
 


//   await getInfo(zone,db).then(async(response)=>{
//     if(response){
//       // console.log('response ', response)
//   await Account.find({username:req.user.username},async(err,role)=>{
//     if(err){
//       throw Error({err:err})
//     }

//     if(role){
//       if(role.length >0){
//         if(role[0].role==='admin'){
//           filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.user.username}`},{$set:{role:'admin'}});
         
     
//              const sensorsList = response
//          const filterationRuleTable=[]
//            await  UserFilter.find({},async(err,result)=>{
//               if(err){
//                 throw Error(err)
//               }

//               if(result){
//                 if(result.length >0){
//                   // console.log('list of user filteration rule', result)
//                   result.forEach(filter=>{

//                     for(let i=0;i<filter.sensor.length;i++){
//                       const filterTable={
//                         username:filter.username,
//                         role:filter.role,
//                         sensor:filter.sensor[i]
//                       }
//                         if(filter.role !=='admin'){
//               filterationRuleTable.push(filterTable)
//                                       }

//                     }
                                      
//                   })
                  
//                 }
               
//               }

//               // console.log('filteration Table ',filterationRuleTable)
//               // console.log('sensorsList ',sensorsList)
//               res.status(200).json({sensor:sensorsList,
//                filterTable:filterationRuleTable})

//              }).clone().catch(function(err){ console.log(err)});

             
           
          
          
//         }else if(role[0].role==='user'){
//           res.json({status:403})
//         }
        
//       }
//     }


//   }).clone().catch(function(err){ console.log(err)});

  
// }

// })


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


  async function defineNewRule(){
  let view =(req.body.rule.view ==="true")
  let action=(req.body.rule.action==="true")

  const sensor_rule ={
    sensor_id:req.body.rule.sensor_id,
    view:view,
    action:action
  }



// console.log('sensor_rule ', sensor_rule)
const sensorIDList=[];

 const sensorInfo = await UserFilter.find({username:`${req.body.rule.email}`},async function(err,result){
    if(result.length > 0){
      
   return result[0]

      
      
    }

  }).clone().catch(function(err){ console.log(err)});

  if(sensorInfo){
    console.log('sensorInfo' ,sensorInfo)
   if(sensorInfo[0].sensor){
    for(let i=0;i<sensorInfo[0].sensor.length;i++){
     
      sensorIDList.push(sensorInfo[0].sensor[i].sensor_id)
      
        }

   }
  
  }

 console.log('sensorIDList ', sensorIDList)
 
 

  if(sensorIDList.includes(req.body.rule.sensor_id)){

    filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`,sensor:{$elemMatch:{sensor_id:`${req.body.rule.sensor_id}`}}},{$set:{"sensor.$.view":view}})
    filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`,sensor:{$elemMatch:{sensor_id:`${req.body.rule.sensor_id}`}}},{$set:{"sensor.$.action":action}})
    }else{
      console.log('new rule')
     filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.body.rule.email}`},{$push:{sensor:sensor_rule}})
    }
  
}




//// RETURN RESULT OF ADD NEW RULES
//// FIRST OF ALL CHECK USERS IS ADMIN OR NOT

await Account.find({username:req.user.username},async(err,role)=>{
  if(err){
    throw Error({err:err})
  }

  if(role){
    if(role.length >0){
      if(role[0].role==='admin'){

        await defineNewRule().then(()=>{
          res.json({status:200})
        }).catch(error=>{
          console.log('error in new filter rule ', error)
          res.json({status:401})
        })

      }
    }
  }

    }).clone().catch(function(err){ console.log(err)});




  





 
  
  //  // filterBoardDB.collection("userfilters").updateMany({username:result[0].username},{$push:{sensor:sensor_rule}})
 
 
})

module.exports=router