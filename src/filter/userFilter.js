const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');
const mqtt = require('mqtt')
const axios =require('axios');

const getFilterData = require("../data/getData");
const getInfo = getFilterData.getData
const Access = require("../db/models/access");

const mongodb = require("../db/config/mongodb");
const filterBoardDB = mongodb.filterBoardDB;

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

router.get('/filter',checkAuthenticated,async(req,res)=>{

  await getInfo(zone,db).then(async(response)=>{
    if(response){
      // console.log('response ', response)
  await Account.find({username:req.user.username},async(err,role)=>{
    if(err){
      throw Error({err:err})
    }

    if(role){
      if(role.length >0){
        if(role[0].role==='admin'){
          filterBoardDB.collection("userfilters").findOneAndUpdate({username:`${req.user.username}`},{$set:{role:'admin'}});
         
     
             const sensorsList = response
         const filterationRuleTable=[]
           await  UserFilter.find({},async(err,result)=>{
              if(err){
                throw Error(err)
              }

              if(result){
                if(result.length >0){
                  // console.log('list of user filteration rule', result)
                  result.forEach(filter=>{

                    for(let i=0;i<filter.sensor.length;i++){
                      const filterTable={
                        username:filter.username,
                        role:filter.role,
                        sensor:filter.sensor[i]
                      }
                        if(filter.role !=='admin'){
              filterationRuleTable.push(filterTable)
                                      }

                    }
                                      
                  })
                  
                }
               
              }

              // console.log('filteration Table ',filterationRuleTable)
              // console.log('sensorsList ',sensorsList)
              res.status(200).json({sensor:sensorsList,
               filterTable:filterationRuleTable})

             }).clone().catch(function(err){ console.log(err)});

             
           
          
          
        }else if(role[0].role==='user'){
          res.json({status:403})
        }
        
      }
    }


  }).clone().catch(function(err){ console.log(err)});

  
}

})


})

router.post('/filter',checkAuthenticated,async(req,res)=>{
 console.log('selected Sensor Serial ', req.body.sensor)
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