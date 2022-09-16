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
  connectTimeout:30* 1000,
  username: 'artemis',
  password: 'A_4281Rtemis7928',
  reconnectPeriod: 1000,
  qos:2,
  customHandleAcks: function(topic, message, packet, done) {console.log('packet',topic)}
})





// JSONSchema --- Data Schema

ajv.addFormat('data-time-format', function(dateTimeString){
  if(typeof dateTimeString ==='object'){
    dateTimeString = dateTimeString.toISOString();
  }

  return !isNaN(Date.parse(dateTimeString));  
})


/**
 There are four boolean combinator keywords in JSON Schema:

   anyOf - OR
   oneOf - XOR (eXclusive OR)
   not - NOT
   allOf - AND


 */














let topic = '/babak/json'

let topics=[]
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
topics.push(r.topic)
  }


  topics.forEach(t=>{
    client.subscribe([t], () => {
      console.log(`Subscribe to topic ${t}`)
    })
  })
 
 
})


client.subscribe([topic], () => {
  console.log(`Subscribe to topic ${topic}`)
})




 
 
})


/** FOR ONE TOPIC */
client.on('message', async(topic,payload)=>{
  // console.log(colors.bgMagenta(topic), payload.toString())
})

/** FOR MULTIPLE TOPICS */
//  client.on('message', async(topics, payload) => {


//   console.log(colors.bgMagenta('topics '),topics)

//   // CHECK JSON SCHEMA

//   const schema = {
//     type:"array",
    
//    items:{
//       type:"object",
//       properties:{
//         device:{type:"string",pattern:"[0-9]"},
//         sensor:{type:"string",pattern:"[0-9]"},
//         name:{type:"string",pattern:"[a-zA-Z0-9]"},
//         time:{type:"string",format:"data-time-format"},
//          value:{"anyOf":[{type:"number"},{type:"string"}]}
       
  
//       },
//       required:["device", "sensor","name"]
//     }
   
   
  
    
  
  
//   }


//   const testNewData= [

//     {site:'hall',device:'00001',sensor:'00001',name:'position'},
//     {site:'hall',device:'00001',sensor:'00002',name:'position'},
//     {site:'hall',device:'00001',sensor:'00003',name:'vibration'},
//     {site:'hall',device:'00002',sensor:'00004',name:'pressure'},
//     {site:'hall',device:'00003',sensor:'00005',name:'lux'},
//     {site:'hall',device:'00003',sensor:'00006',name:'lux'},
//     {site:'hall',device:'00003',sensor:'00007',name:'lux'},
//     {site:'store',device:'00004',sensor:'00008',name:'Piezo'},
//     {site:'store',device:'00005',sensor:'00009',name:'CO2'},
//     {site:'kitchen',device:'00006',sensor:'000010',name:'force'},
//     {site:'kitchen',device:'00007',sensor:'000011',name:'light'},
//     {site:'room1',device:'00008',sensor:'000012',name:'smoke'},
//     {site:'room2',device:'00009',sensor:'000013',name:'vibration'},
//     {site:'room2',device:'00010',sensor:'000014',name:'humidity'},
//     {site:'room3',device:'00011',sensor:'000015',name:'presure'},
//     {site:'room3',device:'00012',sensor:'000016',name:'temprature'},
//     {site:'room3',device:'00013',sensor:'000017',name:'mobility'},
//     {site:'room4',device:'00014',sensor:'000018',name:'force'},
//     {site:'room4',device:'00014',sensor:'000019',name:'fire'},
//     {site:'room4',device:'00014',sensor:'000020',name:'fog'},
//     {site:'room4',device:'00015',sensor:'000021',name:'humidity'},
//     {site:'room4',device:'00015',sensor:'000022',name:'vibration'},
//     {site:'room4',device:'00016',sensor:'000023',name:'lux'},
//     {site:'room5',device:'00017',sensor:'000024',name:'temprature'},
//     {site:'room5',device:'00017',sensor:'000025',name:'noise'},
//     {site:'room5',device:'00017',sensor:'000026',name:'N2O'},
//     {site:'room5',device:'00017',sensor:'000027',name:'toxic'},
//     {site:'room5',device:'00018',sensor:'000028',name:'voltage'},
    
  
  
//   ]
  
  
  
//   const validate = ajv.compile(schema);
  
//   const valid =validate(testNewData)
  
//   if(valid){
//     console.log('valid')

  

//       // await Service.find({topic:topics},async(err,result)=>{
//       //   if(err){
//       //     throw new Error(err)
//       //   }
  
//       //   if(result.length!==0){
//       //    console.log('result in subscriber ', result)
//       //   }
  
//       // }).clone().catch(function (err) {console.log(err)})
  
   

//   }else{
//     console.error(ajv.errorsText(validate.errors))
//   }


//   // END OF CHECK JSON SCHEMA
  
  


// //  console.log('Received Message:','topics is :', topics, payload.toString())
// // // console.log('recieve message ', JSON.parse(payload.toString()))

// // // if((payload.toString()).length > 0 && JSON.parse(payload.toString())){
// // // let json = JSON.parse(payload.toString());

// // // let data = json["office1"]
// // // let dashboard=[];

// // // if(data){
// // //   // console.log('data',data)
  
// // //   for(let i=1;i<data.length;i++){
// // //   data[i]["time"]=`${new Date().toISOString().replace(/.\d+Z$/g,"")}`
// // //   data[i]["created_at"]=`${new Date().toISOString()}`
// // //   dashboard.push(data[i])
// // // }

// // // dashboard.sort(function(a,b){return a.created_at>dashboard[dashboard.length -1].created_at,b})



// // // if(dashboard.length == data.length -1){
// // //   // console.log('dashboard ', dashboard)
// // //   await axios({
// // //     method:"POST",
// // //     url:'http://localhost:5984/cyprus-dev',
// // //    withCredntials:true,
  
// // //     headers:{
// // //       'content-type':'application/json',
// // //       'accept':'application/json'
// // //     },
// // //     auth:{
// // //       username:'admin',
// // //       password:'c0_OU7928CH'
  
// // //     },
// // //     data:{"dashboard":dashboard}
// // //   }).then((response)=>{
// // //     // console.log('response ', response.data.id)

// // //   }).catch(error=>{
// // //     console.error('error in put doc to couchDB ', error)
// // //   })
  


// // // }
  


// // // }


// // // }






    


// })








// /// ACTIVEMQ MQTT 


// }

module.exports = router




