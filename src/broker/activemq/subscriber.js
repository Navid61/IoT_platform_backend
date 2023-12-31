const express = require("express");

var router = express.Router();

const { v4: uuidv4 } = require("uuid");
const colors = require("colors");
const axios = require("axios");
const mqtt = require("mqtt");

const Ajv = require("ajv");

const addFormats = require("ajv-formats");
const ajv = new Ajv({ allErrors: true });

const Service = require("../../db/models/service");
const Device = require("../../db/models/device");
const sensorSite = require("../../db/models/sensorSite");
const actuatorSite = require("../../db/models/actuatorSite");
const totalData = require("../../db/models/total");
const mongodb = require("../../db/config/mongodb");

const deviceDB = mongodb.deviceDB;
const actuatorSiteDB = mongodb.actuatorSiteDB;
const sensorSiteDB = mongodb.sensorSiteDB;
const serviceDB = mongodb.serviceDB;



const r = require("rethinkdb");
const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const { log } = require("console");


///////////

async function makeId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

////////

const host = "49.12.212.20";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clean: true,
  clientId,
  connectTimeout: 30 * 1000,
  username: "artemis",
  password: "A_4281Rtemis7928",
  reconnectPeriod: 1000,
  qos: 2,
  customHandleAcks: function (topic, message, packet, done) {
    console.log("packet", packet);
    console.log("message", message);
    console.log("topic", topic);
  },
});


// Start OF Socket.IO






// Connect to rethinkdb

const connectionOptions = {
  host: '127.0.0.1',
  port: 28015,
  timeout: 30
};


let connection;
let isConnected = false;


async function connectToRethinkDB() {
  try {
      connection = await r.connect(connectionOptions);
      // console.log(colors.red.underline("Connected to RethinkDB"))
   
      isConnected = true;

      connection.on('error', handleConnectionError);

  } catch (error) {
      console.error("Failed to connect to RethinkDB:", error);
      isConnected = false;
      setTimeout(connectToRethinkDB, 5000);
  }
}

function handleConnectionError(error) {
  console.error("Connection error:", error);
  isConnected = false;
  connection.removeListener('error', handleConnectionError);

  if (connection && typeof connection.close === 'function') {
      connection.close();
  }

  setTimeout(connectToRethinkDB, 7000);
}

function ensureConnection() {
  if (!isConnected) {
      throw new Error("RethinkDB connection is not established.");
  }
}


// JSONSchema --- Data Schema

ajv.addFormat("data-time-format", function (dateTimeString) {
  if (typeof dateTimeString === "object") {
    dateTimeString = dateTimeString.toISOString().split(".")[0];
  }

  return !isNaN(Date.parse(dateTimeString));
});

/**
 There are four boolean combinator keywords in JSON Schema:

   anyOf - OR
   oneOf - XOR (eXclusive OR)
   not - NOT
   allOf - AND


 */

// let topic = '/babak/json'
// let topic = "topic1"

// TODO - Get topics list form serviceDB
// Theses topics I think just used for fake data, and it not neccessay when we get currentTopic


let topics = [];

client.on("connect", async () => {
  // GET TOPIC

  try {
    let result = await Service.find({}); // Assuming Service.find returns a promise
    
    if (Array.isArray(result)) {
        topics = result.map(r => r.topic);

      
        await client.subscribe(topics); // Assuming client.subscribe returns a promise
        console.log('Subscribed to ' + colors.bgYellow(colors.red(` ${topics}`)));
    } else {
        console.error("Error: Expected result to be an array.");
    }
} catch (err) {
    console.error("Error getting and subscribing to topics:", err);
}
 
});


// In this part we get message form current topic or message sent form current topic

client.on('message', (topic, message) => {
  console.log(`Received message from topic: ${topic}`);
  console.log('Message content: ' + colors.bgMagenta(`${message.toString()}`));
});

client.on('error', (error) => {
  console.error(`MQTT Error: ${error.message}`);
});



/////// FAKE PART


//trasform data -- DO NOT Remove in final version
function transformData(data) {
  const { atr, data: entries } = data;
  const { device, timedate, site } = atr;
  
  const result = [];

  entries.forEach(entry => {
    let newEntry = {};
    newEntry.site = site 
    newEntry.device = device;
    newEntry.timedate = timedate;
    
    if(entry.sensor) {
      newEntry.sensor = entry.sensor;
    } else if(entry.actuator) {
      newEntry.actuator = entry.actuator;
    }

    newEntry.name = entry.name;
    newEntry.value = entry.value;

    result.push(newEntry);
  });

  return result;
}




//trasnform data


const uniqueAcrossPropertiesKeyword = {
  keyword: 'uniqueAcrossProperties',
  type: 'array',
  schemaType: 'array',
  validate: function (schema, data) {
      if (!Array.isArray(data)) {
          return false;
      }

      const seenValues = new Set();

      for (const item of data) {
          for (const property of schema) {
              const valueToCheck = item[property];
              if (valueToCheck && seenValues.has(valueToCheck)) {
                  return false;
              }
              seenValues.add(valueToCheck);
          }
      }

      return true;
  },
  metaSchema: {
      type: 'array',
      items: {
          type: 'string'
      }
  }
};



ajv.addVocabulary([uniqueAcrossPropertiesKeyword]);

const sampleData = {
  atr: {
    device: "00001",
    timedate: new Date().toISOString(),
    name: "master",
   
  },
  data: [
    { sensor: "00001", name: "temp", value: 20 },
    { actuator: "00002", name: "vaccum", value: "on" },
    { sensor: "00003", name: "moisture", value: 25 },
    { sensor: "00004", name: "pressure", value: 1330 },
    { actuator: "00005", name: "tv", value: "on" },
    { actuator: "00006", name: "light", value: "off" },
    { sensor: "00007", name: "lux", value: 29 },
    { sensor: "00008", name: "gps", value: { lon: 19.040236, lat: 47.497913 } },
  ],
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
  sampleData.data.forEach((sensor) => {
    if (sensor.name === "pressure") {
      sensor.value = getRandomNumber(1000, 2000);
    } else if (sensor.name === "lux") {
      sensor.value = getRandomNumber(20, 100);
    } else if (sensor.name === "temp") {
      sensor.value = getRandomNumber(10, 50);
    }
    else if (sensor.name === "moisture") {
      sensor.value = getRandomNumber(0, 100);
    }
  });

  // Randomly duplicate the device name
  if (Math.random() < 0.3) {
    const duplicateSensor = sampleData.data.find(
      (sensor) => sensor.name === "pressure"
    );
    duplicateSensor.sensor = sampleData.data.find(
      (sensor) => sensor.name === "lux"
    ).sensor;
  }

  // Print the updated data
// ensure that the values for both sensor and actuator properties are unique across the entire data array

 

  const baseSchema = {
    type: "object",
    properties: {
      atr: {
        type: "object",
        properties: {
          device: { type: "string" },
          timedate: { type: "string", format: "data-time-format" }, // Corrected the format value to "date-time"
          name: { type: "string" },
        },
        required: ["device", "timedate", "name"],
      },
      data: {
        type: "array",
        // uniqueAcrossProperties: ['sensor', 'actuator'],
        items: {
          type: "object",
          oneOf: [
            {
              properties: {
                sensor: { type: "string" },
                name: { type: "string" },
                value: {
                  oneOf: [
                    { type: "number" },
                    { type: "string", enum: ["on", "off"] },
                  ],
                },
              },
              required: ["sensor", "name", "value"],
            },
            {
              properties: {
                actuator: { type: "string" },
                name: { type: "string" },
                value: {
                  oneOf: [
                    { type: "boolean" },
                    { type: "integer", enum: [0, 1] },
                    { type: "string" },
                  ],
                },
              },
              required: ["actuator", "name", "value"],
            },
          ],
        },
      },
    },
    required: ["atr", "data"],
  };

  function dataHasGPS(data) {
    return data.some(
      (item) =>
        item.name === "gps" &&
        typeof item.value === "object" &&
        "lon" in item.value &&
        "lat" in item.value
    );
  }

  function updateSchemaForGPS(data) {
    if (dataHasGPS(data)) {
      const gpsProperty = {
        type: "object",
        properties: {
          lon: { type: "number" },
          lat: { type: "number" },
        },
        required: ["lon", "lat"],
      };

      // Update the schema to validate GPS data
      baseSchema.properties.data.items.oneOf[0].properties.value.oneOf.push(
        gpsProperty
      );
    }
  }

  //  console.log(sampleData);




  updateSchemaForGPS(sampleData.data);
  const sensorValidate = await ajv.compile(baseSchema);
  const sensorValid = await sensorValidate(sampleData);

  // if (!sensorValid) {
  //   console.log(sensorValidate.errors); // Inspect the errors if validation failed
  // }

  let receivedSensorData = [];

  let sensorDataModel = [];

  if (sensorValid) {
    // console.log('sampleData valid is ', sampleData);
    for (let i = 0; i < sampleData.data.length; i++) {
      const addId = uuidv4() + "-" + (await makeId(10));

      const dataItem = {
        id: addId,
        site: "",
        device: sampleData.atr.device,
        name: sampleData.data[i].name,
        value: sampleData.data[i].value,
        time: sampleData.atr.timedate,
      };

      // Check if it's a sensor or actuator and assign accordingly
      if (sampleData.data[i].sensor) {
        dataItem.sensor = sampleData.data[i].sensor;
      } else if (sampleData.data[i].actuator) {
        dataItem.actuator = sampleData.data[i].actuator;
      }

      receivedSensorData.push(dataItem);

      if (sampleData.data[i].sensor) {
        sensorDataModel.push({
          id: addId,
          site: "",
          device: sampleData.atr.device,
          sensor: sampleData.data[i].sensor,
          name: sampleData.data[i].name,
        });
      } else if (sampleData.data[i].actuator) {
        sensorDataModel.push({
          id: addId,
          site: "",
          device: sampleData.atr.device,
          actuator: sampleData.data[i].actuator,
          name: sampleData.data[i].name,
        });
      }
    }

    // Ensure each object in receivedSensorData has both 'sensor' and 'actuator' fields
    // receivedSensorData = receivedSensorData.map((item) => ({
    //   ...item,
    //   sensor: item.sensor || null,
    //   actuator: item.actuator || null,
    // }));

    // console.log('sensorDataModel ', sensorDataModel)

    // sensor sites -- for create sensor group

    //  Search in Service Database until find a topic is related to found service
   
    if (topics.length > 0) {


     

      topics.forEach(async (t) => {
       
        await Service.find({ topic: t }, async (err, result) => {
          if (err) {
            throw new Error("erorr in topic");
          }
          //  console.log('result service ', result)
          if (result.length > 0) {
            const service_id = result[0].service_id;
            const topic = result[0].topic;

            if (sensorDataModel) {
              // console.log('sensorDataModel ===> ', sensorDataModel)
              await sensorSite
                .find({ service_id: service_id }, async (err, result) => {
                  if (err) {
                    throw new Error(err);
                  }

                  //  console.log("topic", `${topics}`, "service_id", `${service_id}`)

                  // If exist data for topic in sensorSite colletion inside MongoDB

                  if (result.length > 0) {
                    const sensorData = result[0].data;

                    for await (const s of sensorDataModel) {
                      //  console.log('sensor device ', s.device, 'sensor Id ', s.sensor)

                      // separate sensors data and store them in sensorSiteDB
                      if (s.sensor) {
                        await sensorSite
                          .find(
                            {
                              service_id: service_id,
                              data: {
                                $elemMatch: {
                                  device: s.device,
                                  sensor: s.sensor,
                                },
                              },
                            },
                            async (err, result) => {
                              if (err) {
                                throw new Error(err);
                              }

                              // Check Here

                              if (result.length === 0) {
                                // Auto update content of data array ion sensorDatabase based on sensor(s) cahanges (add or remove) in devices
                                // when do any changes in count of sensors inside device, it's data in database must be update
                                (async () => {
                                  await sensorSiteDB
                                    .collection("sensorsites")
                                    .updateOne(
                                      { service_id: service_id },
                                      { $push: { data: s } }
                                    );
                                })();
                              } else {
                                // TODO - remove sensor data and devices after 24 without response from
                                // Update database and remove sensor
                              }
                            }
                          )
                          .clone()
                          .catch(function (err) {
                            console.log(err);
                          });
                      }

                      // if(sensorData.find((item)=>item.device!==s.device)){
                      //   await sensorSiteDB.collection('sensorsites').updateOne({service_id:service_id},{$push:{data:s}})
                      // }
                    }
                  } else {
                    // console.log(
                    //   "sensorDataModel insert to sensorSite database for first time ",
                    //   sensorDataModel
                    // );
                    // for first time when data array in sensorSites colleciton is empty.
                    // remove actuators from data model
                    const filterActuators = sensorDataModel.filter((item) => {
                      if (item.actuator) {
                        return "";
                      } else {
                        return item;
                      }
                    });

                    if (filterActuators.length > 0) {
                      (async () => {
                        await sensorSiteDB.collection("sensorsites").insertOne({
                          service_id: service_id,
                          data: filterActuators,
                        });
                      })();
                    }
                  }
                })
                .clone()
                .catch(function (err) {
                  console.log(err);
                })

// insert actuator for each device in separate collection and data base

                await actuatorSite
                .find({ service_id: service_id }, async (err, result) => {
                  if (err) {
                    throw new Error(err);
                    
                  }

                  //  console.log("topic", `${topics}`, "service_id", `${service_id}`)

                  // If exist data for topic in sensorSite colletion inside MongoDB

                  if (result.length > 0) {
                    const actuatorData = result[0].data;

                   

                    for await (const s of sensorDataModel) {
                      //  console.log('sensor device ', s.device, 'sensor Id ', s.sensor)
                      if (s.actuator) {
                       
                        await actuatorSite
                          .find(
                            {
                              service_id: service_id,
                              data: {
                                $elemMatch: {
                                  device: s.device,
                                  actuator: s.actuator,
                                },
                              },
                            },
                            async (err, result) => {
                              if (err) {
                                throw new Error(err);
                              }

                              // Check Here

                              if (result.length === 0) {
                                // Auto update content of data array ion sensorDatabase based on sensor(s) cahanges (add or remove) in devices
                                // when do any changes in count of sensors inside device, it's data in database must be update
                                (async () => {
                                  await actuatorSiteDB
                                    .collection("actuatorsites")
                                    .updateOne(
                                      { service_id: service_id },
                                      { $push: { data: s } }
                                    );
                                })();
                              } else {
                                // TODO - remove actuator data and devices after 24 without response from
                                // Update database and remove actuaor
                              }
                            }
                          )
                          .clone()
                          .catch(function (err) {
                            console.log(err);
                          });
                      }

                      // if(actuatorData.find((item)=>item.device!==s.device)){
                      //   await actuaorSiteDB.collection('actuaorsites').updateOne({service_id:service_id},{$push:{data:s}})
                      // }
                    }
                  } else {
                    // console.log(
                    //   "sensorDataModel insert to actuatorSite database for first time ",
                    //   sensorDataModel
                    // );
                    // for first time when data array in sensorSites colleciton is empty.

                    const filterSensors = sensorDataModel.filter((item) => {
                      if (item.sensor) {
                        return '';
                      } else {
                        return item;
                      }
                    });

                    if (filterSensors.length > 0) {
                      (async () => {
                        await actuatorSiteDB
                          .collection("actuatorsites")
                          .insertOne({
                            service_id: service_id,
                            data: filterSensors,
                          });
                      })();
                    }
                  }
                })
                .clone()
                .catch(function (err) {
                  console.log(err);
                });
                
            }

            //  console.log('receivedSensorData ', receivedSensorData)

            // check device array in document of topic
            await Device.find(
              { service_id: service_id },
              async (err, deviceResult) => {
                if (err) {
                  throw new Error(err);
                }

                // console.log('deviceResult in device ', deviceResult)

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
                        throw new Error(err);
                      }
                      if (result) {

                        
                        if (result.length === 0) {
                          
                         /// if can not find device in device array
                          // add missing device or new device

                       
                            await deviceDB.collection("devices").updateOne(
                              { service_id: service_id },
                              {
                                $push: {
                                  device: {
                                    device: sampleData.atr.device,
                                    site: "",
                                  },
                                },
                              }
                            );
                        } 
                      }
                    }
                  )
                    .clone()
                    .catch(function (err) {
                      console.log(err);
                    });
                } else {

                  // This is only for first time
              
                    await deviceDB.collection("devices").insertOne({
                      service_id: service_id,
                      device: [{device: sampleData.atr.device, site: "" }],
                    });

                    // update socket io and refreshData, if do any changes here
                    // deviceNamespace.emit("refreshData");
                 
                }
              }
            )
              .clone()
              .catch(function (err) {
                console.log(
                  "error in get device database info in subscriber section ",
                  err
                );
              });
          }
        })
          .clone()
          .catch(function (err) {
            console.log("error in get topic in subscriber section ", err);
          });
      });
    }

    // TODO - Store sensor data in CouchDB
    // Remember - Empty receivedSensorData array for each time data stored in couchdb
    // Use nano npmjs for CouchDB connection
    if (receivedSensorData.length > 0) {
   


      
   

      // async () => {
      //   await axios({
      //     method: "POST",
      //     url: "http://127.0.0.1:5984/cyprus-dev",
      //     withCredntials: true,

      //     headers: {
      //       "content-type": "application/json",
      //     },
      //     auth: {
      //       username: "admin",
      //       password: "c0_OU7928CH",
      //     },
      //     data: { docs: receivedSensorData },
      //   })
      //     .then((response) => {
      //       // console.log('response ', response)
      //     })
      //     .catch((error) => {
      //       console.error("error in put doc to couchDB ", error);
      //     });
      // };

      // For each topic create different database and table
    } 

// Start test mode

// step 1 -- chage data format for saving in mongodb

async function getTransformedData(transFormedData, t, s){
  if(transFormedData && transFormedData.length > 0){
    return {
      data:transFormedData,
      db:t,
      table:s
    }
  }

}


 // if data was valid it will start add to mongodb
topics.forEach( (t) => {
  Service.find({ topic: t }, async (err, result) => {
    if (err) {
      throw new Error("erorr in topic");
    }
    //  console.log('result service ', result)
    if (result.length > 0) {
      const service_id = result[0].service_id;
      const topic = result[0].topic;


      // get add site to each items in transformedData

      await Device.find({service_id:service_id},async(err, result)=>{
        if (err) {
          throw new Error("erorr in totalData");
        }

        if(result.length>0){
          let deviceSitesInfo = result[0].device
        
if(deviceSitesInfo && deviceSitesInfo.length > 0 && deviceSitesInfo.every(item=>item.site!==''&& item.site!==undefined)){
const deviceToSearch = sampleData.atr.device;

const foundMapping = deviceSitesInfo.find(mapping => mapping.device === deviceToSearch);


if (foundMapping) {
  sampleData.atr.site = foundMapping.site;
}

const transformedData =  transformData(sampleData);

// console.log(transformedData);

//

await totalData.find({service_id:service_id,topic:topic},async(err,result)=>{
  if (err) {
    throw new Error("erorr in totalData");
  }
  // console.log('result ', result[0].data);
 
  if(result.length===0  && transformedData.length > 0){

   //only for fist time create document and insert first data
      const newData = new totalData({
        service_id: service_id,
        topic: topic,
        data:transformedData
        
    });

    newData.save().then(() => {
      console.log('Data inserted successfully');
  })
  .catch(err => {
      console.error('Error inserting data:', err);
  });

 
 
    
    
  


  }else if(result.length>0 && result[0].data.length > 0 && transformedData.length > 0){
    const existData= result[0].data
    const existDeviceName =existData.map((item=>{
      if(item.device){
        return item.device
      }
    }))

    const deviceInsertedList = [...new Set(existDeviceName)]
   
// console.log('deviceInsertedList ', deviceInsertedList);


    // totalData.find({
    //   service_id:service_id,
    //   topic:topic,

    // },async(err,result)=>{
    //   if (err) {
    //     throw new Error("erorr in totalData");
    //   }

    //   if(result.length > 0){
    //     console.log('result data field in totaData model ', result[0])
    //   }
    // })

  }
}).clone()
.catch(function (err) {
console.log("error in get topic in subscriber section ", err);
});


//


}

//log this error
// else {
//   console.error('error: one or more than one device(s) has not site',topic,service_id)
// }

        }
      }).clone()
      .catch(function (err) {
        console.log("error in get topic in subscriber section ", err);
      });


     
      // check data array in totalDB is empty or not
      // if it was empty add data (sampleData) if not please check if it was exist update them if they were new add them

     

 


    }
  }) .clone()
  .catch(function (err) {
    console.log("error in get topic in subscriber section ", err);
  });
})
// Enf test mode

// insert data to rethinkdb:


let tablesPerDatabase = {};
let databasesName = topics;


async function createDatabase(dbName) {
  ensureConnection();

  try {
      const databases = await r.dbList().run(connection);
      if (!databases.includes(dbName)) {
          await r.dbCreate(dbName).run(connection);
      }
  } catch (error) {
      console.error(`Failed to create database ${dbName}:`, error);
  }
}

async function createTable(dbName, tableName) {
  ensureConnection();

  try {
      const tables = await r.db(dbName).tableList().run(connection);
      if (!tables.includes(tableName)) {
          await r.db(dbName).tableCreate(tableName).run(connection);
      }
  } catch (error) {
      console.error(`Failed to create table ${tableName} in ${dbName}:`, error);
  }
}


// topic name selected for database name and service id chosen for table
/**
 * 
 * const databases = ['db1', 'db2', 'db3']; // List of databases to create
   const tablesPerDatabase = {
    'db1': ['table1', 'table2'],
    'db2': ['table3'],
    'db3': ['table4', 'table5']
}; // List of tables to create for each database
 */


//

async function processTopic(topic) {
  try {
      const result = await Service.find({ topic: topic }).clone()
      .catch(function (err) {
        console.log("error in get topic in subscriber section ", err);
      }); // Assuming you're using Mongoose or a similar ORM
      if (result && result.length > 0) {
          const service_id = result[0].service_id;

          if (tablesPerDatabase[topic]) {
            tablesPerDatabase[topic].push(service_id);
          } else {
            tablesPerDatabase[topic] = [service_id];
          }
      }
  } catch (err) {
      console.error("Error in get topic in subscriber section:", err);
  }
}


function monitorChanges(dbName, tableName) {

  ensureConnection() 
  r.db(dbName).table(tableName).changes().run(connection, (err, cursor) => {
      if (err) throw err;
      cursor.each((err, change) => {
          if (err) throw err;
          console.log("Change detected:", change);
      });
  });
}


async function insertData(dbName, tableName, data) {
  try {
      let table = r.db(dbName).table(tableName);
      let result = await table.insert(data).run(connection);
      return result;
  } catch (err) {
      console.error(`Error inserting data into ${dbName}.${tableName}:`, err);
      throw err;
  }
}



async function handleDeviceData(dbName, tableName) {
  // console.log('tableName 1 ', tableName);
 
  try {
      const results = await Device.find({service_id: tableName}).clone()
      .catch(function (err) {
        console.log("error in get topic in subscriber section ", err);
      });
      if (results.length > 0) {
        
          const deviceSitesInfo = results[0].device;
          // in this condition only services all site are defined already will choose
          if (deviceSitesInfo.every(item => item.site !== '' && item.site !== undefined)) {
              const deviceToSearch = sampleData.atr.device;
              const foundMapping = deviceSitesInfo.find(mapping => mapping.device === deviceToSearch);

              if (foundMapping) {
                  sampleData.atr.site = foundMapping.site;
              }

              const transformedData = transformData(sampleData);
              if (transformedData && transformedData.length > 0) {
               
               await insertData(dbName, tableName, transformedData);
                // TODO A candidate place for checking the conditions table and sending commands to devices
              }
          }
      }
  } catch (error) {
      console.log("Error in handleDeviceData:", error);
  }
}

(async function init() {
  try {
      await connectToRethinkDB();

      for (let topic of topics) {
          await processTopic(topic);
      }

      for (let dbName of databasesName) {

       
          await createDatabase(dbName);

          if (tablesPerDatabase[dbName]) {
              for (let tableName of tablesPerDatabase[dbName]) {
                  await createTable(dbName, tableName);
                  
                  await handleDeviceData(dbName, tableName);
                  
              }
          }
      }
  } catch (error) {
      console.error("An error occurred during the initialization:", error);
  } finally {
      if (connection && typeof connection.close === 'function') {
          connection.close();
      }
  }
})();


 
  }else {
    console.error(ajv.errorsText(sensorValidate.errors));
  }
}

// Update the data every 40 seconds (40000 milliseconds)
setInterval(updateData, 40000);

/////// FAKE PART

module.exports ={
  router,
  connection,
  ensureConnection,
  connectToRethinkDB
};
