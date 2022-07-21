const express = require('express')

var router = express.Router();

const {v4:uuidv4} = require("uuid");
const colors = require('colors');
const axios =require('axios');
const mqtt = require('mqtt');

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




