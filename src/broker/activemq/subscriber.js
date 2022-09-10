const express = require('express')

var router = express.Router();

const {v4:uuidv4} = require("uuid");
const colors = require('colors');
const axios =require('axios');
const mqtt = require('mqtt');

const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv()

const Service = require('../../db/models/service');



///////////

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}




////////




const host = '194.5.195.11'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clean: true,
  clientId,
  connectTimeout: 4000,
  username: 'artemis',
  password: 'A_4281Rtemis7928',
  reconnectPeriod: 1000,
  // customHandleAcks: function(topic, message, packet, done) {console.log('packet',topic)}
})


// JSONSchema --- Data Schema

ajv.addFormat('data-time-format', function(dateTimeString){
  if(typeof dateTimeString ==='object'){
    dateTimeString = dateTimeString.toISOString();
  }

  return !isNaN(Date.parse(dateTimeString));  
})

const schema = {
  type:"array",
  
 items:{
    type:"object",
    properties:{
      device:{type:"integer"},
      sensor:{type:"integer"},
      name:{type:"string",pattern:"[a-zA-Z]"},
      time:{type:"string",format:"data-time-format"},
      value:{type:"number"}

    },
    required:["device", "sensor","name"]
  }
 
 

  


}





const testNewData= [

  {"device":1,"sensor":1,"name":"position","site":""},
  {"device":1,"sensor":2,"name":"pressure","site":""},
  {"device":1,"sensor":3,"name":"lux","site":""},
  {"device":1,"sensor":4,"name":"Piezo","site":""},
  {"device":2,"sensor":5,"name":"CO2","site":""},
  {"device":3,"sensor":6,"name":"force","site":""},
  {"device":4,"sensor":7,"name":"light","site":""},
  {"device":4,"sensor":8,"name":"smoke","site":""},
  {"device":5,"sensor":9,"name":"vibration","site":""},
  {"device":6,"sensor":10,"name":"humidity","site":""},
  {"device":7,"sensor":11,"name":"humidity","site":""},
  {"device":8,"sensor":12,"name":"humidity","site":""},
  {"device":9,"sensor":13,"name":"humidity","site":""},
  {"device":10,"sensor":14,"name":"humidity","site":""},
  {"device":11,"sensor":15,"name":"humidity","site":""},
  {"device":12,"sensor":16,"name":"humidity","site":""},
  {"device":13,"sensor":17,"name":"humidity","site":""},
  {"device":14,"sensor":18,"name":"humidity","site":""}
  


]



const validate = ajv.compile(schema);

const valid =validate(testNewData)

if(valid){
  console.log('valid')
}else{
  console.error(ajv.errorsText(validate.errors))
}






let topic = '/babak/json'

let topic2=[]
client.on('connect', async() => {

  // GET TOPIC

await (async()=>{
 return await Service.find({}, async(err,result)=>{
    if(err){
      throw new Error('Error i get topic in subscriber')
    }
  
    if(result){
    
      return result

      }
      
    

   
      // client.subscribe([topic2], () => {
      //   console.log(`Subscribe to topic ${topic2}`)
      // })
   

  

   
  }).clone().catch(function (err) {console.log(err)})

  
})().then(async(response)=>{
  for await (const r of response){
topic2.push(r.topic)
  }


  topic2.forEach(t=>{
    client.subscribe([t], () => {
      console.log(`Subscribe to topic ${t}`)
    })
  })
 
 
})


client.subscribe([topic], () => {
  console.log(`Subscribe to topic ${topic}`)
})




 
 
})



client.on('message', async(topic,payload)=>{
  // console.log(`${topic}:`, payload.toString())
})


// client.on('message', async(topic2, payload) => {
// console.log('Received Message:', topic2, payload.toString())
// // console.log('recieve message ', JSON.parse(payload.toString()))

// // if((payload.toString()).length > 0 && JSON.parse(payload.toString())){
// // let json = JSON.parse(payload.toString());

// // let data = json["office1"]
// // let dashboard=[];

// // if(data){
// //   // console.log('data',data)
  
// //   for(let i=1;i<data.length;i++){
// //   data[i]["time"]=`${new Date().toISOString().replace(/.\d+Z$/g,"")}`
// //   data[i]["created_at"]=`${new Date().toISOString()}`
// //   dashboard.push(data[i])
// // }

// // dashboard.sort(function(a,b){return a.created_at>dashboard[dashboard.length -1].created_at,b})



// // if(dashboard.length == data.length -1){
// //   // console.log('dashboard ', dashboard)
// //   await axios({
// //     method:"POST",
// //     url:'http://localhost:5984/cyprus-dev',
// //    withCredntials:true,
  
// //     headers:{
// //       'content-type':'application/json',
// //       'accept':'application/json'
// //     },
// //     auth:{
// //       username:'admin',
// //       password:'c0_OU7928CH'
  
// //     },
// //     data:{"dashboard":dashboard}
// //   }).then((response)=>{
// //     // console.log('response ', response.data.id)

// //   }).catch(error=>{
// //     console.error('error in put doc to couchDB ', error)
// //   })
  


// // }
  


// // }


// // }






    


// })








// /// ACTIVEMQ MQTT 


// }

module.exports = router




