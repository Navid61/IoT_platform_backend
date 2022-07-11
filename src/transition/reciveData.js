const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');

const axios =require('axios');

const UserFilter= require("../db/models/filter")


// CHECK USER AUTHENTICATION FOR LOGIN
var checkAuthenticated = function (req, res, next){
  // console.log('req.isAuthenticated is ', req.isAuthenticated())
    if (req.isAuthenticated())
     {
        return next()
    }
  }

router.use(checkAuthenticated);
// CHECK USER AUTHENTICATION FOR LOGIN



/// ACTIVEMQ MQTT







router.get('/receive',checkAuthenticated,async(req,res)=>{


const dbname = 'cyprus-dev';
await axios({
    method:"GET",
    url:`http://localhost:5984/${dbname}/_changes?descending=true&limit=1&feed=longpoll`,
    withCredentials:true,
     headers:{
      'content-type':'application/json',
      'accept':'application/json'
    },
    auth:{
      username:'admin',
      password:'c0_OU7928CH'
    },

  }).then((response)=>{
  
 console.log('response from get last changes in database ',response.data.results[0].id)



  const docID = response.data.results[0].id

getLatestDocValue(docID)


}).catch(error=>{
    console.error('error in received data from couchdb ', error)
})

async function getLatestDocValue(docID){
 
 const url = `http://localhost:5984/cyprus-dev/${docID}`
 await axios({
method:"GET",
url:url,
withCredentials:true,
maxBodyLength:Infinity,
headers:{
  'content-type':'application/json',
  'accept':'application/json'
},
auth:{
  username:'admin',
  password:'c0_OU7928CH'

},

}).then(async(response)=>{
  // console.log('response ', response.data)
const sensorData = [];
const dashboard =response.data.dashboard
const sensorViewList=[]

await UserFilter.find({username:`${req.user.username}`},async(err,filter)=>{
  if(err){
    throw Error('Error in finding filter rules in userfilters collection in filterDB')
  }

  if(filter){
    if(filter.length > 0){



 if(filter[0].role !=='admin'){
  for(let i =0; i<filter[0].sensor.length;i++){
    if(filter[0].sensor[i].view === true){
      console.log('permitted sensor for view',filter[0].sensor[i].sensor_id)
      sensorViewList.push(filter[0].sensor[i].sensor_id)
    }
  }

  for (let i =0;i<dashboard.length;i++){
    // console.log('dashboard ', dashboard[i].sensor_id)
    if(sensorViewList){
      if(sensorViewList.includes(dashboard[i].sensor_id)){
        const user_data ={
          "sensor_id":dashboard[i].sensor_id,
          "name":dashboard[i].name,
          "reading":[dashboard[i].time,dashboard[i].value],
          // "read":true,
          // "write":false
          }
          sensorData.push(user_data)
       }

    }
  
    
   }

   sensorData.sort(function(a,b){return a.reading[0]>dashboard[dashboard.length -1].created_at,b})

   if(sensorData.length >0 &&(sensorData.length == sensorViewList.length)){

  

    res.status(200).json({dashboard:sensorData})
    }
 

 }else if(filter[0].role==='admin'){

  for (let i =0;i<dashboard.length;i++){
    // console.log('dashboard ', dashboard[i].sensor_id)
        const user_data ={
          "sensor_id":dashboard[i].sensor_id,
          "name":dashboard[i].name,
          "reading":[dashboard[i].time,dashboard[i].value],
          // "read":true,
          // "write":false
          }
          sensorData.push(user_data)
     
    
   }

  //  console.log('dashboard ====> ', colors.magenta(dashboard[dashboard.length -1].created_at))
   sensorData.sort(function(a,b){return a.reading[0]>sensorData[sensorData.length -1].reading[0],b})
  //  console.log(colors.red(sensorData[sensorData.length -1].reading[0]))
  //  sensorData.forEach(t=>{
  //   console.log('time in sensor data list ', t.reading[0])
    
  //  })





   if(sensorData.length >0 &&(sensorData.length === dashboard.length)){

    res.status(200).json({dashboard:sensorData})
    }
 


 }
    


     

      
     
    }
  }
}).clone().catch(function(err){ console.log(err)});

 








}).catch(error=>{
  console.error('error in document reading content from couchdb ', error)
})


}
})

router.post('/receive',checkAuthenticated,async(req,res)=>{
  console.log('receive from front-end backend ', req)
  res.status(200).json({
    msg:"I received your post!"
  })

})


module.exports = router