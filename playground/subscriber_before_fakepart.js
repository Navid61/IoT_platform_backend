/** FOR MULTIPLE TOPICS */
// name in data should be device serial number or any code make it unique
// if each sensor has its own id we can use that instead of create an id for each them manualy
/**
 * 
 *  const fake_data={
    atr:{
      device: '00001',
      timedate: Date.now(),
      name:'master'
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

// this part must be check if it gives me a unique topics, it no need use loop for service for check topics loop
//  instead of that I can rename topics here to a different name like currentTopic
/** */
// Start of client message
// client.on("message", async (currentTopic, payload) => {
//   console.log(colors.bgMagenta(`${currentTopic}`), payload.toString());

//   // const sensorSchema = {
//   //   type: "object",
//   //   properties: {
//   //     atr: {
//   //       type: "object",
//   //       properties: {
//   //         device: { type: "string" },
//   //         timedate: { type: "string", format: "data-time-format" },
//   //         name: { type: "string" }
//   //       },
//   //     },
//   //     data: {
//   //       type: "array",
//   //       items: {
//   //         type: "object",
//   //         properties: {
//   //           sensor: { type: "string" },
//   //           name: { type: "string" },
//   //           value: { type: "number" }
//   //         },
//   //       },
//   //     },
//   //   },
//   // }

//   const sensorActuatorSchema = {
//     type: "object",
//     properties: {
//       atr: {
//         type: "object",
//         properties: {
//           device: { type: "string" },
//           timedate: { type: "string", format: "data-time-format" },
//           name: { type: "string" },
//         },
//       },
//       data: {
//         type: "array",
//         items: {
//           type: "object",
//           properties: {
//             component: {
//               type: "string",
//               enum: ["sensor", "actuator"],
//             },
//             name: { type: "string" },
//             value: { type: "number" },
//           },
//           required: ["component", "name", "value"],
//         },
//       },
//     },
//     required: ["atr", "data"],
//   };

//   let objData = await JSON.parse(payload.toString());

//   const sensorValidate = await ajv.compile(sensorActuatorSchema);
//   const sensorValid = await sensorValidate(objData);

//   /* CHECK JSON SCHEMA */

//   /** For Tutorial
//   items:{
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
// */

//   let receivedSensorData = [];

//   let sensorDataModel = [];

//   if (sensorValid) {
//     for (let i = 0; i < objData.data.length; i++) {
//       // attention: this code create different id for same device, we must investigate this is ok or not?
//       const addId = uuidv4() + "-" + (await makeId(10));

//       receivedSensorData.push({
//         id: addId,
//         site: "",
//         device: objData.atr.device,
//         sensor: objData.data[i].sensor,
//         name: objData.data[i].name,
//         value: objData.data[i].value,
//         time: objData.atr.timedate,
//       });

//       // Create a template for system configuration -sensorDataModel

//       sensorDataModel.push({
//         id: addId,
//         site: "",
//         device: objData.atr.device,
//         sensor: objData.data[i].sensor,
//         name: objData.data[i].name,
//       });
//     }

//     // sensor sites -- for create sensor group

//     //  Search in Service Database until find a topic is related to found service

//     // check all topics array
//     //  I use forEach loop to check all topics in topics array

//     await Service.find({ topic: currentTopic }, async (err, result) => {
//       if (err) {
//         throw new Error("erorr in topic");
//       }

//       if (result.length > 0) {
//         const service_id = result[0].service_id;
//         const topic = result[0].topic;

//         if (sensorDataModel) {
//           await sensorSite
//             .find({ service_id: service_id }, async (err, result) => {
//               if (err) {
//                 throw new Error(err);
//               }

//               //  console.log("topic", `${topics}`, "service_id", `${service_id}`)

//               // If exist data for topic in sensorSite colletion inside MongoDB

//               if (result.length > 0) {
//                 const sensorData = result[0].data;

//                 for await (const s of sensorDataModel) {
//                   //  console.log('sensor device ', s.device, 'sensor Id ', s.sensor)

//                   await sensorSite
//                     .find(
//                       {
//                         service_id: service_id,
//                         data: {
//                           $elemMatch: { device: s.device, sensor: s.sensor },
//                         },
//                       },
//                       async (err, result) => {
//                         if (err) {
//                           throw new Error(err);
//                         }

//                         // Check Here

//                         if (result.length === 0) {
//                           // Auto update content of data array ion sensorDatabase based on sensor(s) cahanges (add or remove) in devices
//                           // when do any changes in count of sensors inside device, it's data in database must be update
//                           (async () => {
//                             await sensorSiteDB
//                               .collection("sensorsites")
//                               .updateOne(
//                                 { service_id: service_id },
//                                 { $push: { data: s } }
//                               );
//                           })();
//                         } else {
//                           // TODO - remove sensor data and devices after 24 without response from
//                           // Update database and remove sensor
//                         }
//                       }
//                     )
//                     .clone()
//                     .catch(function (err) {
//                       console.log(err);
//                     });

//                   // if(sensorData.find((item)=>item.device!==s.device)){
//                   //   await sensorSiteDB.collection('sensorsites').updateOne({service_id:service_id},{$push:{data:s}})
//                   // }
//                 }
//               } else {
//                 // for firsttime when data array in sensorSites colleciton is empty.
//                 (async () => {
//                   await sensorSiteDB.collection("sensorsites").insertOne({
//                     service_id: service_id,
//                     data: sensorDataModel,
//                   });
//                 })();
//               }
//             })
//             .clone()
//             .catch(function (err) {
//               console.log(err);
//             });

            
//         }

//         // console.log('receivedSensorData ', receivedSensorData)

//         // check device array in document of topic
//         await Device.find(
//           { service_id: service_id },
//           async (err, deviceResult) => {
//             if (err) {
//               throw new Error(err);
//             }

//             // If it can find device array is not empty
//             if (deviceResult.length !== 0) {
//               // console.log('objData.atr.device ', objData.atr.device)

//               await Device.find(
//                 {
//                   service_id: service_id,
//                   device: { $elemMatch: { device: objData.atr.device } },
//                 },
//                 async (err, result) => {
//                   if (err) {
//                     throw new Error(err);
//                   }
//                   if (result) {
//                     if (result.length !== 0) {
//                       // if find device in device array
//                       //  console.log('service_id: ', service_id, 'result ', result[0].device)
//                     } else {
//                       // if can not find device in device array
//                       // add missing device or new device

//                       (async () => {
//                         await deviceDB.collection("devices").updateOne(
//                           { service_id: service_id },
//                           {
//                             $push: {
//                               device: {
//                                 device: objData.atr.device,
//                                 site: "",
//                               },
//                             },
//                           }
//                         );
//                       })();
//                     }
//                   }
//                 }
//               )
//                 .clone()
//                 .catch(function (err) {
//                   console.log(err);
//                 });
//             } else {
//               (async () => {
//                 await deviceDB.collection("devices").insertOne({
//                   service_id: service_id,
//                   device: [{ device: objData.atr.device, site: "" }],
//                 });
//               })();
//             }
//           }
//         )
//           .clone()
//           .catch(function (err) {
//             console.log(
//               "error in get device database info in subscriber section ",
//               err
//             );
//           });
//       }
//     })
//       .clone()
//       .catch(function (err) {
//         console.log("error in get topic in subscriber section ", err);
//       });

//     // TODO - Store sensor data in CouchDB
//     // Remember - Empty receivedSensorData array for each time data stored in couchdb
//     // Use nano npmjs for CouchDB connection

//     // Store fake data in CouchDB or rethinkDB

//     // console.log('recievedSensoprdata ', receivedSensorData)
//   } else {
//     console.error(ajv.errorsText(sensorValidate.errors));
//   }

//   // const testNewData= [

//   //   {site:'hall',device:'00001',sensor:'00001',name:'position'},
//   //   {site:'hall',device:'00001',sensor:'00002',name:'position'},
//   //   {site:'hall',device:'00001',sensor:'00003',name:'vibration'},
//   //   {site:'hall',device:'00002',sensor:'00004',name:'pressure'},
//   //   {site:'hall',device:'00003',sensor:'00005',name:'lux'},
//   //   {site:'hall',device:'00003',sensor:'00006',name:'lux'},
//   //   {site:'hall',device:'00003',sensor:'00007',name:'lux'},
//   //   {site:'store',device:'00004',sensor:'00008',name:'Piezo'},
//   //   {site:'store',device:'00005',sensor:'00009',name:'CO2'},
//   //   {site:'kitchen',device:'00006',sensor:'000010',name:'force'},
//   //   {site:'kitchen',device:'00007',sensor:'000011',name:'light'},
//   //   {site:'room1',device:'00008',sensor:'000012',name:'smoke'},
//   //   {site:'room2',device:'00009',sensor:'000013',name:'vibration'},
//   //   {site:'room2',device:'00010',sensor:'000014',name:'humidity'},
//   //   {site:'room3',device:'00011',sensor:'000015',name:'presure'},
//   //   {site:'room3',device:'00012',sensor:'000016',name:'temprature'},
//   //   {site:'room3',device:'00013',sensor:'000017',name:'mobility'},
//   //   {site:'room4',device:'00014',sensor:'000018',name:'force'},
//   //   {site:'room4',device:'00014',sensor:'000019',name:'fire'},
//   //   {site:'room4',device:'00014',sensor:'000020',name:'fog'},
//   //   {site:'room4',device:'00015',sensor:'000021',name:'humidity'},
//   //   {site:'room4',device:'00015',sensor:'000022',name:'vibration'},
//   //   {site:'room4',device:'00016',sensor:'000023',name:'lux'},
//   //   {site:'room5',device:'00017',sensor:'000024',name:'temprature'},
//   //   {site:'room5',device:'00017',sensor:'000025',name:'noise'},
//   //   {site:'room5',device:'00017',sensor:'000026',name:'N2O'},
//   //   {site:'room5',device:'00017',sensor:'000027',name:'toxic'},
//   //   {site:'room5',device:'00018',sensor:'000028',name:'voltage'},

//   // ]

//   // Check file schema for actucators (WITHOUT GATEWAYS)

//   const actuatorSchema = {
//     type: "object",
//     properties: {
//       atr: {
//         type: "object",
//         properties: {
//           device: { type: "string" },
//           timedate: { type: "string", format: "data-time-format" },
//         },
//       },
//       data: {
//         type: "array",
//         items: {
//           type: "object",
//           properties: {
//             actuator: { type: "string" },
//             status: { type: "string" },
//             value: { anyOf: [{ type: "number" }, { type: "boolean" }] },
//             color: { anyOf: [{ type: "number" }, { type: "boolean" }] },
//             code: { anyOf: [{ type: "number" }, { type: "boolean" }] },
//           },
//         },
//       },
//     },
//   };

//   const actuatorValidate = await ajv.compile(actuatorSchema);
//   const actuatorValid = await actuatorValidate(objData);

//   if (actuatorValid) {
//     let receivedActuatorData = [];
//   } else {
//     console.error(ajv.errorsText(actuatorValid.errors));
//   }

//   // END OF CHECK JSON SCHEMA

//   //  console.log('Received Message:','topics is :', topics, payload.toString())
//   // // console.log('recieve message ', JSON.parse(payload.toString()))

//   // // if((payload.toString()).length > 0 && JSON.parse(payload.toString())){
//   // // let json = JSON.parse(payload.toString());

//   // // let data = json["office1"]
//   // // let dashboard=[];

//   // // if(data){
//   // //   // console.log('data',data)

//   // //   for(let i=1;i<data.length;i++){
//   // //   data[i]["time"]=`${new Date().toISOString().replace(/.\d+Z$/g,"")}`
//   // //   data[i]["created_at"]=`${new Date().toISOString()}`
//   // //   dashboard.push(data[i])
//   // // }

//   // // dashboard.sort(function(a,b){return a.created_at>dashboard[dashboard.length -1].created_at,b})

//   // // if(dashboard.length == data.length -1){
//   // //   // console.log('dashboard ', dashboard)
//   // //   await axios({
//   // //     method:"POST",
//   // //     url:'http://localhost:5984/cyprus-dev',
//   // //    withCredntials:true,

//   // //     headers:{
//   // //       'content-type':'application/json',
//   // //       'accept':'application/json'
//   // //     },
//   // //     auth:{
//   // //       username:'admin',
//   // //       password:'c0_OU7928CH'

//   // //     },
//   // //     data:{"dashboard":dashboard}
//   // //   }).then((response)=>{
//   // //     // console.log('response ', response.data.id)

//   // //   }).catch(error=>{
//   // //     console.error('error in put doc to couchDB ', error)
//   // //   })

//   // // }

//   // // }

//   // // }
// });

// End of cleitn message

//

// /// ACTIVEMQ MQTT

// }