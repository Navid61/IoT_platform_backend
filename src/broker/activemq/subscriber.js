const express = require("express")

var router = express.Router()

const { v4: uuidv4 } = require("uuid")
const colors = require("colors")
const axios = require("axios")
const mqtt = require("mqtt")

const Ajv = require("ajv")
const addFormats = require("ajv-formats")
const ajv = new Ajv()

const Service = require("../../db/models/service")
const Device = require("../../db/models/device")
const sensorSite = require("../../db/models/sensorSite")

const mongodb = require("../../db/config/mongodb")

const deviceDB = mongodb.deviceDB
const sensorSiteDB = mongodb.sensorSiteDB

///////////

function makeId(length) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

////////

const host = "49.12.212.20"
const port = "1883"
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clean: true,
  clientId,
  connectTimeout: 30 * 1000,
  username: "artemis",
  password: "A_4281Rtemis7928",
  reconnectPeriod: 1000,
  qos: 2,
  customHandleAcks: function (topic, message, packet, done) {
    console.log("packet", packet)
    console.log("message", message)
    console.log("topic", topic)
  },
})

// JSONSchema --- Data Schema

ajv.addFormat("data-time-format", function (dateTimeString) {
  if (typeof dateTimeString === "object") {
    dateTimeString = dateTimeString.toISOString().split(".")[0]
  }

  return !isNaN(Date.parse(dateTimeString))
})

/**
 There are four boolean combinator keywords in JSON Schema:

   anyOf - OR
   oneOf - XOR (eXclusive OR)
   not - NOT
   allOf - AND


 */

// let topic = '/babak/json'
let topic = "topic1"

// TODO - Get topics list form serviceDB

let topics = ["topic1", "topic2"]

client.on("connect", async () => {
  // GET TOPIC

  await (async () => {
    return await Service.find({}, async (err, result) => {
      if (err) {
        throw new Error("Error i get topic in subscriber")
      }

      if (result) {
        return result
      }

      // client.subscribe([topic2], () => {
      //   console.log(`Subscribe to topic ${topic2}`)
      // })
    })
      .clone()
      .catch(function (err) {
        console.log(err)
      })
  })().then(async (response) => {
    for await (const r of response) {
      topics.push(r.topic)
    }

    topics.forEach((t) => {
      client.subscribe([t], () => {
        console.log(`Subscribe to ${t}`)
      })
    })
  })

  client.subscribe([topic], () => {
    console.log('Subscribed to ' + colors.bgYellow(` ${topic}`))
  })
})

/** FOR ONE TOPIC */
// client.on('message', async(topic,payload)=>{
// console.log(colors.bgMagenta(topic), payload.toString())
// })

/** FOR MULTIPLE TOPICS */

/**
 * 
 *  const fake_data={
    atr:{
      device: '00001',
      timedate: Date.now()
    },
    data:[
        {sensor:'00001',name:'temp', value:20},
        {sensor:'00002',name:'lux',value:110},
        {sensor:'00003',name:'pressure', value:1110},
        {sensor:'00004',name:'pressure',value:1330},
        {sensor:'00005',name:'lux',value:25},
        {sensor:'00006',name:'lux',value:94},
        {sensor:'00007',name:'lux',value:29}
      
        
    ]
  }
 */
client.on("message", async (topics, payload) => {
   console.log(colors.bgMagenta(`${topics}`),payload.toString())


 


  const sensorSchema = {
    type: "object",
    properties: {
      atr: {
        type: "object",
        properties: {
          device: { type: "string" },
          timedate: { type: "string", format: "data-time-format" },
        },
      },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sensor: { type: "string" },
            name: { type: "string" },
            value: { type: "number" },
          },
        },
      },
    },
  }

  let objData = JSON.parse(payload.toString())

  const sensorValidate = ajv.compile(sensorSchema)
  const sensorValid = sensorValidate(objData)


  



  /* CHECK JSON SCHEMA */

  
  /** For Tutorial
  items:{
      type:"object",
      properties:{
        device:{type:"string",pattern:"[0-9]"},
        sensor:{type:"string",pattern:"[0-9]"},
        name:{type:"string",pattern:"[a-zA-Z0-9]"},
        time:{type:"string",format:"data-time-format"},
         value:{"anyOf":[{type:"number"},{type:"string"}]}
       
  
      },
      required:["device", "sensor","name"]
    }
*/



  let receivedSensorData = []

  let sensorDataModel = []

  if (sensorValid) {

    for (let i = 0; i < objData.data.length; i++) {
      const addId = uuidv4() + '-' + makeId(10)

      receivedSensorData.push({
        id:addId,
        site: "",
        device: objData.atr.device,
        sensor: objData.data[i].sensor,
        name: objData.data[i].name,
        value: objData.data[i].value,
        time: objData.atr.timedate,
      })


      // Create a template for system configuration -sensorDataModel

      sensorDataModel.push({
        id:addId,
        site: "",
        device: objData.atr.device,
        sensor: objData.data[i].sensor,
        name: objData.data[i].name,
      })
    }

    // sensor sites -- for create sensor group

    //  Search in Service Database until find a topic is related to found service

    await Service.find({ topic: topics }, async (err, result) => {
      if (err) {
        throw new Error("erorr in topic")
      }

      if (result.length > 0) {
        const service_id = result[0].service_id
        const topic = result[0].topic

        if (sensorDataModel) {
          await sensorSite
            .find({ service_id: service_id }, async (err, result) => {
              if (err) {
                throw new Error(err)
              }

              // console.log("topic", `${topics}`, "service_id", `${service_id}`)

              // If exist data for topic in sensorSite colletion inside MongoDB

              if (result.length > 0) {
                const sensorData = result[0].data

                for await (const s of sensorDataModel) {
                  //  console.log('sensor device ', s.device, 'sensor Id ', s.sensor)

                  await sensorSite
                    .find(
                      {
                        service_id: service_id,
                        data: {
                          $elemMatch: { device: s.device, sensor: s.sensor },
                        },
                      },
                      async (err, result) => {
                        if (err) {
                          throw new Error(err)
                        }

                        // Check Here

                        if (result.length === 0) {
                          // Auto update content of data array ion sensorDatabase based on sensor(s) cahanges (add or remove) in devices
                          // when do any changes in count of sensors inside device, it's data in database must be update
                          ;(async () => {
                            await sensorSiteDB
                              .collection("sensorsites")
                              .updateOne(
                                { service_id: service_id },
                                { $push: { data: s } }
                              )
                          })()
                        } else {
                          // TODO - remove sensor data and devices after 24 without response from 
                          // Update database and remove sensor
                        }
                      }
                    )
                    .clone()
                    .catch(function (err) {
                      console.log(err)
                    })

                  // if(sensorData.find((item)=>item.device!==s.device)){
                  //   await sensorSiteDB.collection('sensorsites').updateOne({service_id:service_id},{$push:{data:s}})
                  // }
                }
              } else {
                // for firsttime when data array in sensorSites colleciton is empty.
                ;(async () => {
                  await sensorSiteDB
                    .collection("sensorsites")
                    .insertOne({
                      service_id: service_id,
                      data: sensorDataModel,
                    })
                })()
              }
            })
            .clone()
            .catch(function (err) {
              console.log(err)
            })
        }

        //  console.log('receivedSensorData ', receivedSensorData)

        // check device array in document of topic
        await Device.find(
          { service_id: service_id },
          async (err, deviceResult) => {
            if (err) {
              throw new Error(err)
            }

            // If it can find device array is not empty
            if (deviceResult.length !== 0) {
              // console.log('objData.atr.device ', objData.atr.device)

              await Device.find(
                {
                  service_id: service_id,
                  device: { $elemMatch: { device: objData.atr.device } },
                },
                async (err, result) => {
                  if (err) {
                    throw new Error(err)
                  }
                  if (result) {
                    if (result.length !== 0) {
                      // if find device in device array
                      //  console.log('service_id: ', service_id, 'result ', result[0].device)
                    } else {
                      // if can not find device in device array
                      // add missing device or new device

                      ;(async () => {
                        await deviceDB
                          .collection("devices")
                          .updateOne(
                            { service_id: service_id },
                            {
                              $push: {
                                device: {
                                  device: objData.atr.device,
                                  site: "",
                                },
                              },
                            }
                          )
                      })()
                    }
                  }
                }
              )
                .clone()
                .catch(function (err) {
                  console.log(err)
                })
            } else {
              ;(async () => {
                await deviceDB
                  .collection("devices")
                  .insertOne({
                    service_id: service_id,
                    device: [{ device: objData.atr.device, site: "" }],
                  })
              })()
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(
              "error in get device database info in subscriber section ",
              err
            )
          })
      }
    })
      .clone()
      .catch(function (err) {
        console.log("error in get topic in subscriber section ", err)
      })


  // TODO - Store sensor data in CouchDB
  // Remember - Empty receivedSensorData array for each time data stored in couchdb
  // Use nano npmjs for CouchDB connection

  // Store fake data in CouchDB

  // console.log('recievedSensoprdata ', receivedSensorData)




  } else {
    console.error(ajv.errorsText(sensorValidate.errors))
  }

 
  

  // const testNewData= [

  //   {site:'hall',device:'00001',sensor:'00001',name:'position'},
  //   {site:'hall',device:'00001',sensor:'00002',name:'position'},
  //   {site:'hall',device:'00001',sensor:'00003',name:'vibration'},
  //   {site:'hall',device:'00002',sensor:'00004',name:'pressure'},
  //   {site:'hall',device:'00003',sensor:'00005',name:'lux'},
  //   {site:'hall',device:'00003',sensor:'00006',name:'lux'},
  //   {site:'hall',device:'00003',sensor:'00007',name:'lux'},
  //   {site:'store',device:'00004',sensor:'00008',name:'Piezo'},
  //   {site:'store',device:'00005',sensor:'00009',name:'CO2'},
  //   {site:'kitchen',device:'00006',sensor:'000010',name:'force'},
  //   {site:'kitchen',device:'00007',sensor:'000011',name:'light'},
  //   {site:'room1',device:'00008',sensor:'000012',name:'smoke'},
  //   {site:'room2',device:'00009',sensor:'000013',name:'vibration'},
  //   {site:'room2',device:'00010',sensor:'000014',name:'humidity'},
  //   {site:'room3',device:'00011',sensor:'000015',name:'presure'},
  //   {site:'room3',device:'00012',sensor:'000016',name:'temprature'},
  //   {site:'room3',device:'00013',sensor:'000017',name:'mobility'},
  //   {site:'room4',device:'00014',sensor:'000018',name:'force'},
  //   {site:'room4',device:'00014',sensor:'000019',name:'fire'},
  //   {site:'room4',device:'00014',sensor:'000020',name:'fog'},
  //   {site:'room4',device:'00015',sensor:'000021',name:'humidity'},
  //   {site:'room4',device:'00015',sensor:'000022',name:'vibration'},
  //   {site:'room4',device:'00016',sensor:'000023',name:'lux'},
  //   {site:'room5',device:'00017',sensor:'000024',name:'temprature'},
  //   {site:'room5',device:'00017',sensor:'000025',name:'noise'},
  //   {site:'room5',device:'00017',sensor:'000026',name:'N2O'},
  //   {site:'room5',device:'00017',sensor:'000027',name:'toxic'},
  //   {site:'room5',device:'00018',sensor:'000028',name:'voltage'},

  // ]

  // Check file schema for actucators (WITHOUT GATEWAYS)

 
      
   const actuatorSchema = {
    type: "object",
    properties: {
      atr: {
        type: "object",
        properties: {
          device: { type: "string" },
          timedate: { type: "string", format: "data-time-format" },
        },
      },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            actuator: { type: "string" },
            status: { type: "string" },
            value: { anyOf: [{ type: "number" }, { type: "boolean" }] },
            color: { anyOf: [{ type: "number" }, { type: "boolean" }] },
            code: { anyOf: [{ type: "number" }, { type: "boolean" }] },
          },
        },
      },
    },
  }

  const actuatorValidate = ajv.compile(actuatorSchema)
  const actuatorValid = actuatorValidate(objData)

  if (actuatorValid) {
    let receivedActuatorData = []
  } else {
    console.error(ajv.errorsText(actuatorValid.errors))
  }

  
  // END OF CHECK JSON SCHEMA

  //  console.log('Received Message:','topics is :', topics, payload.toString())
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
})




// /// ACTIVEMQ MQTT

// }


/////// FAKE PART



const sampleData = {
  atr: {
    device: '00001',
    timedate: new Date().toISOString()
  },
  data: [
    { sensor: '00001', name: 'temp', value: 20 },
    { sensor: '00002', name: 'lux', value: 110 },
    { sensor: '00003', name: 'pressure', value: 1110 },
    { sensor: '00004', name: 'pressure', value: 1330 },
    { sensor: '00005', name: 'lux', value: 25 },
    { sensor: '00006', name: 'temp', value: 14 },
    { sensor: '00007', name: 'lux', value: 29 }
  ]
};

// Function to generate a random number within a specified range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to update the device name and randomize sensor values
async function updateData() {
  // Update the device name
  const currentDeviceNumber = parseInt(sampleData.atr.device.slice(-5));
  let nextDeviceNumber;

  if (currentDeviceNumber < 10) {
    nextDeviceNumber = currentDeviceNumber + 1;
  } else {
    nextDeviceNumber = 1;
  }

  sampleData.atr.device = `00000${nextDeviceNumber}`.slice(-5);

  // Randomize sensor values
  sampleData.data.forEach(sensor => {
    if (sensor.name === 'pressure') {
      sensor.value = getRandomNumber(1000, 2000);
    } else if (sensor.name === 'lux') {
      sensor.value = getRandomNumber(20, 100);
    } else if (sensor.name === 'temp') {
      sensor.value = getRandomNumber(10, 50);
    }
  });

  // Randomly duplicate the device name
  if (Math.random() < 0.3) {
    const duplicateSensor = sampleData.data.find(sensor => sensor.name === 'pressure');
    duplicateSensor.sensor = sampleData.data.find(sensor => sensor.name === 'lux').sensor;
  }

  // Print the updated data

  const sensorSchema = {
    type: "object",
    properties: {
      atr: {
        type: "object",
        properties: {
          device: { type: "string" },
          timedate: { type: "string" },
        },
      },
      data: {
        type: "array",
        items: {
          type: "object",
          properties: {
            sensor: { type: "string" },
            name: { type: "string" },
            value: { type: "number" },
          },
        },
      },
    },
  }
 console.log(sampleData);
  
  
  const sensorValidate = ajv.compile(sensorSchema)
  const sensorValid = sensorValidate(sampleData)

 

  let receivedSensorData = []

  let sensorDataModel = []

  if (sensorValid) {

    for (let i = 0; i < sampleData.data.length; i++) {
      const addId = uuidv4() + '-' + makeId(10)

      receivedSensorData.push({
        id:addId,
        site: "",
        device: sampleData.atr.device,
        sensor: sampleData.data[i].sensor,
        name: sampleData.data[i].name,
        value: sampleData.data[i].value,
        time: sampleData.atr.timedate,
      })


      // Create a template for system configuration -sensorDataModel

      sensorDataModel.push({
        id:addId,
        site: "",
        device: sampleData.atr.device,
        sensor: sampleData.data[i].sensor,
        name: sampleData.data[i].name,
      })
    }


    // console.log('sensorDataModel ', sensorDataModel)


   

    // sensor sites -- for create sensor group

    //  Search in Service Database until find a topic is related to found service

    await Service.find({ topic: topics }, async (err, result) => {
      if (err) {
        throw new Error("erorr in topic")
      }
      // console.log('result service ', result)
      if (result.length > 0) {
       
        const service_id = result[0].service_id
        const topic = result[0].topic

        if (sensorDataModel) {
          await sensorSite
            .find({ service_id: service_id }, async (err, result) => {
              if (err) {
                throw new Error(err)
              }

              //  console.log("topic", `${topics}`, "service_id", `${service_id}`)

              // If exist data for topic in sensorSite colletion inside MongoDB

              if (result.length > 0) {
                const sensorData = result[0].data

                for await (const s of sensorDataModel) {
                  //  console.log('sensor device ', s.device, 'sensor Id ', s.sensor)

                  await sensorSite
                    .find(
                      {
                        service_id: service_id,
                        data: {
                          $elemMatch: { device: s.device, sensor: s.sensor },
                        },
                      },
                      async (err, result) => {
                        if (err) {
                          throw new Error(err)
                        }

                        // Check Here

                        if (result.length === 0) {
                          // Auto update content of data array ion sensorDatabase based on sensor(s) cahanges (add or remove) in devices
                          // when do any changes in count of sensors inside device, it's data in database must be update
                          ;(async () => {
                            await sensorSiteDB
                              .collection("sensorsites")
                              .updateOne(
                                { service_id: service_id },
                                { $push: { data: s } }
                              )
                          })()
                        } else {
                          // TODO - remove sensor data and devices after 24 without response from 
                          // Update database and remove sensor
                        }
                      }
                    )
                    .clone()
                    .catch(function (err) {
                      console.log(err)
                    })

                  // if(sensorData.find((item)=>item.device!==s.device)){
                  //   await sensorSiteDB.collection('sensorsites').updateOne({service_id:service_id},{$push:{data:s}})
                  // }
                }
              } else {
                // for firsttime when data array in sensorSites colleciton is empty.
                ;(async () => {
                  await sensorSiteDB
                    .collection("sensorsites")
                    .insertOne({
                      service_id: service_id,
                      data: sensorDataModel,
                    })
                })()
              }
            })
            .clone()
            .catch(function (err) {
              console.log(err)
            })
        }

        //  console.log('receivedSensorData ', receivedSensorData)

        // check device array in document of topic
        await Device.find(
          { service_id: service_id },
          async (err, deviceResult) => {
            if (err) {
              throw new Error(err)
            }

            // If it can find device array is not empty
            if (deviceResult.length !== 0) {
              // console.log('objData.atr.device ', objData.atr.device)

              await Device.find(
                {
                  service_id: service_id,
                  device: { $elemMatch: { device: sampleData.atr.device } },
                },
                async (err, result) => {
                  if (err) {
                    throw new Error(err)
                  }
                  if (result) {
                    if (result.length !== 0) {
                      // if find device in device array
                        console.log('service_id: ', service_id, 'result ', result[0].device)
                    } else {
                      // if can not find device in device array
                      // add missing device or new device

                      ;(async () => {
                        await deviceDB
                          .collection("devices")
                          .updateOne(
                            { service_id: service_id },
                            {
                              $push: {
                                device: {
                                  device: sampleData.atr.device,
                                  site: "",
                                },
                              },
                            }
                          )
                      })()
                    }
                  }
                }
              )
                .clone()
                .catch(function (err) {
                  console.log(err)
                })
            } else {
              ;(async () => {
                await deviceDB
                  .collection("devices")
                  .insertOne({
                    service_id: service_id,
                    device: [{ device: sampleData.atr.device, site: "" }],
                  })
              })()
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(
              "error in get device database info in subscriber section ",
              err
            )
          })
      }
    })
      .clone()
      .catch(function (err) {
        console.log("error in get topic in subscriber section ", err)
      })


  // TODO - Store sensor data in CouchDB
  // Remember - Empty receivedSensorData array for each time data stored in couchdb
  // Use nano npmjs for CouchDB connection
  if(receivedSensorData.length > 0){

   

    await axios({
      method:"POST",
      url:'http://127.0.0.1:5984/cyprus-dev',
     withCredntials:true,
  
      headers:{
        'content-type':'application/json',
        
      },
      auth:{
        username:'admin',
        password:'c0_OU7928CH'
  
      },
      data:{docs:receivedSensorData}
    }).then((response)=>{
      // console.log('response ', response)
  
    }).catch(error=>{
      console.error('error in put doc to couchDB ', error)
    })
  
    } else {
      console.error(ajv.errorsText(sensorValidate.errors))
    }

  }
 

}

// Update the data every 40 seconds (40000 milliseconds)
setInterval(updateData, 20000);




/////// FAKE PART





module.exports = router
