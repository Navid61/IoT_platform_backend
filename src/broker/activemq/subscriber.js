const express = require('express')

var router = express.Router();

const {v4:uuidv4} = require("uuid");
const colors = require('colors');
const axios =require('axios');
const mqtt = require('mqtt');


// const prand = require('pure-rand');
// const { mersenne } = require('pure-rand');

// const seed = 42;

// Instanciates a Mersenne Twister
// random number generator with the seed=42
// const gen1 = prand.mersenne(seed);
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
let iotData;
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


const topic = '/babak/json'
client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
 
})

client.on('message', async(topic, payload) => {
//  console.log('Received Message:', topic, JSON.parse(payload.toString()))
let json = JSON.parse(payload.toString());
const data = json["office1"]

 
if(data){
  const dashboard=[];
  for(let i=1;i<data.length;i++){
  data[i]["time"]=`${new Date().toISOString().replace(/.\d+Z$/g,"")}`
  data[i]["created_at"]=`${new Date().toISOString()}`
dashboard.push(data[i])
dashboard.sort(function(a,b){return a.created_at>dashboard[dashboard.length -1].created_at,b})
if(dashboard.length == data.length -1){
    await axios({
      method:"POST",
      url:'http://localhost:5984/cyprus-dev',
     withCredntials:true,
    
      headers:{
        'content-type':'application/json',
        'accept':'application/json'
      },
      auth:{
        username:'admin',
        password:'c0_OU7928CH'
    
      },
      data:{"dashboard":dashboard}
    }).then((response)=>{
      // console.log('response ', response.data.id)

    }).catch(error=>{
      console.error('error in put doc to couchDB ', error)
    })
    
 
  
}



}

  


}


    


})








// /// ACTIVEMQ MQTT 


// }






