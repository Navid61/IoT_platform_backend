const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const Service= require('../db/models/service');

const SensorsGroup = require('../db/models/sensors')

const ActuatorsGroup = require('../db/models/actuator')

const FilterRule = require('../db/models/filter')

const Scene = require('../db/models/scene');

const Device = require("../db/models/device")


const mongodb = require("../db/config/mongodb");
const UserGroup = require("../db/models/usergroup");

const Stream = require("../db/models/stream");

const filterBoardDB = mongodb.filterBoardDB

const sceneDB = mongodb.sceneDB

const sensorSite = require("../db/models/sensorSite");
const actuatorSite = require("../db/models/actuatorSite");


const deviceDB = mongodb.deviceDB


const checkAuthenticated = function (req, res, next) {
  
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)


router.get("/stream/:id",  async (req, res) => {
  const service_id=req.params.id

// console.log('service_id in stream part ', service_id);
  await Scene.find({service_id:service_id},{_id:0}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length!==0){

      // console.log('result ', result)

  
           res.status(200).json({scenes:result})
 

        
       
    }
 }).clone().catch(function (err) {console.log(err)})


})



router.post("/stream/getdevicesite",  async (req, res) => {
  const service_id=req.body.id

// console.log('service_id in stream part ', service_id);


await Device.find({service_id:service_id},{_id:0}, async(err,result)=>{
  if(err){
      throw new Error(err)
  }

  if(result.length!==0){

  // console.log('result ', result[0].device)

  
// Attention Data must be store an array even for one device site
  if (Array.isArray(result[0].device) && result[0].device.length > 0) {
   const deviceSitesNameList = result[0].device.every(element => element.site && element.site !== '');

    if (deviceSitesNameList) {
      res.status(200).json({ devices: result[0].device });
    } else {
      res.status(404).json({ message: "No device sites found" });
    }
   
 } else {
  res.status(404).json({ message: "No zites found for the given service ID and devices" });
}



     
     
  }
}).clone().catch(function (err) {console.log(err)})


})


router.post("/stream/getsensorslist", async (req, res) => {

  const service_id=req.body.id
  const deviceName = req.body.device

  let sensorsInDevice =[]

  // console.log('service_id in getsensorslist ', service_id)

  try {

    await sensorSite.find({service_id:service_id}, async(err,result)=>{
      if(err){
          throw new Error(err)
      }
  
      if(result.length > 0){
        //  console.log('result ', result[0].data)
        const sensorsData = result[0].data
        if(sensorsData.length > 0){
          sensorsInDevice = sensorsData.filter((item)=>{
            if(item.device===deviceName){
              return item
            }else {
  return ''
            }
          });
        }
     
        // console.log('sensors in device ', sensorsInDevice)
        if(sensorsInDevice && sensorsInDevice!==null && sensorsInDevice!==undefined){
          res.status(200).json({sensor:sensorsInDevice})
        }
       
  
      }
    }).clone().catch(function (err) {console.log(err)})
  
    
  } catch (error) {
    console.log('error in get sensors list in device ', error);
  }

  

})







router.post("/stream/getactuatorslist",  async (req, res) => {

  const service_id=req.body.id
  const deviceName = req.body.device

  let actuatorsInDevice =[]

  // console.log('service_id in getactuatorslist ', service_id)

  try {

    await actuatorSite.find({service_id:service_id}, async(err,result)=>{
      if(err){
          throw new Error(err)
      }
  
      if(result.length > 0){
        // console.log('result ', result[0].data)
        const actuatorsData = result[0].data
        if(actuatorsData.length > 0){
          actuatorsInDevice = actuatorsData.filter((item)=>{
            if(item.device===deviceName){
              return item
            }else {
  return ''
            }
          });
        }
     
        // console.log('actuators in device ', actuatorsInDevice)
        if(actuatorsInDevice && actuatorsInDevice!==null && actuatorsInDevice!==undefined){
          res.status(200).json({actuator:actuatorsInDevice})
        }
       
  
      }
    }).clone().catch(function (err) {console.log(err)})
  
    
  } catch (error) {
    console.log('error in get actuators list in device ', error);
  }

  


})

router.post("/stream/duplicatecheck",async(req,res)=>{
  const service_id=req.body.id

  console.log('service_id new condition ', service_id);

  Stream.find({service_id:service_id}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result && result.length > 0){
      console.log('result ', result);
    }
  }).clone().catch(function (err) {console.log(err)})

})

router.post("/stream/newrule",async (req, res)=>{

  const service_id=req.body.id

  console.log('service_id new condition ', service_id);

  const conditionsTable = req.body.conditions
  const schedule= req.body.schedule

  console.log('schedule ', schedule, 'conditionTable ', conditionsTable);

  await Stream.find({service_id:service_id}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result){
      console.log('result ', result);
    }
  }).clone().catch(function (err) {console.log(err)})
// table name is service_id
/**
 * 
 * Without .coerceTo('array'): The result of your query would be a sequence, which is essentially an iterable object. You'd typically have to loop over it to extract all the individual items.

With .coerceTo('array'): The result of your query is explicitly an array, allowing you to directly access items using indices or use array-specific operations.
 */

/**
 * 
 
async function fetchLatestDataForDevice(site, device, partNumber, partType) {
  // Here, partType can be 'sensor' or 'actuator' and partNumber is the associated ID.

  let filterCondition = {
      site: site,
      device: device
  };

  filterCondition[partType] = partNumber;  // This dynamically adds either 'sensor' or 'actuator' to the filter condition

  return await r.table(service_id)
                .orderBy(r.desc('timestamp'))
                .filter(filterCondition)
                .limit(1)
                .coerceTo('array');
}


  function evaluateSingleCondition(data, condition) {
    switch (condition.operand) {
        case "eq":
            return data.value === condition.value;
        case "ne":
            return data.value !== condition.value;
        case "lte":
            return data.value <= condition.value;
        case "lt":
            return data.value < condition.value;
        case "gte":
            return data.value >= condition.value;
        case "gt":
            return data.value > condition.value;
        default:
            return false;
    }
}


async function evaluateAllConditions(conditions) {
  let results = [];

  for (let condition of conditions) {
    const latestData = await fetchLatestDataForDevice(condition.site, condition.device, condition[condition.part], condition.part);

      
      if (latestData && latestData.length > 0) {
          const evaluation = evaluateSingleCondition(latestData[0], condition);
          results.push(evaluation);
      } else {
          results.push(false);
      }
  }

  // Combining results based on logical conditions
  let finalResult = results[0];
  for (let i = 1; i < conditions.length; i++) {
      if (conditions[i].logical === "AND") {
          finalResult = finalResult && results[i];
      } else if (conditions[i].logical === "OR") {
          finalResult = finalResult || results[i];
      }
  }

  return finalResult;
}

try {
  const result = await evaluateAllConditions(conditionsTable);
  console.log(result);  // true if all conditions are met, false otherwise
  res.status(200).send({result: result});
} catch (err) {
  console.error("Error evaluating conditions:", err);
  res.status(500).send({error: "Failed to evaluate conditions"});
}
* 
 */
/**
 * 
 * [
    {
        "id": 1,
        "site": "kitchen",
        "device": "00002",
        "part": "sensor",
        "name": "temp",
        "operand": "gte",
        "value": "12",
        "logical": "AND",
        "sensor": "00001"
    },
    {
        "id": 2,
        "site": "kitchen",
        "device": "00002",
        "part": "sensor",
        "name": "temp",
        "operand": "lte",
        "value": "23",
        "logical": "AND",
        "sensor": "00001"
    },
    {
        "id": 3,
        "site": "kitchen",
        "device": "00002",
        "part": "sensor",
        "name": "temp",
        "operand": "gte",
        "value": "20",
        "logical": "OR",
        "sensor": "00001"
    },
    {
        "id": 4,
        "site": "kitchen",
        "device": "00002",
        "part": "sensor",
        "name": "temp",
        "operand": "lte",
        "value": "34",
        "logical": "AND",
        "sensor": "00001"
    },
    {
        "id": 5,
        "site": "hall",
        "device": "00007",
        "part": "actuator",
        "name": "light",
        "operand": "eq",
        "value": "off",
        "logical": "AND",
        "actuator": "00006"
    },
    {
        "id": 6,
        "site": "room1",
        "device": "00004",
        "part": "sensor",
        "name": "temp",
        "operand": "gte",
        "value": "11",
        "logical": "AND",
        "sensor": "00001"
    },
    {
        "id": 7,
        "site": "room2",
        "device": "00005",
        "part": "sensor",
        "name": "gps",
        "operand": "eq",
        "value": "2344",
        "logical": "OR",
        "sensor": "00008"
    },
    {
        "id": 8,
        "site": "room3",
        "device": "00006",
        "part": "actuator",
        "name": "light",
        "operand": "eq",
        "value": "on",
        "logical": "OR",
        "actuator": "00006"
    },
    {
        "id": 9,
        "site": "room3",
        "device": "00008",
        "part": "actuator",
        "name": "vaccum",
        "operand": "eq",
        "value": "off",
        "logical": "AND",
        "actuator": "00002"
    },
    {
        "id": 10,
        "site": "garge",
        "device": "00010",
        "part": "actuator",
        "name": "vaccum",
        "operand": "eq",
        "value": "on",
        "logical": "OR",
        "actuator": "00002"
    }
]
 * 
 * Given the conditions array you've provided and the code we previously discussed, here's how the code would behave:

The function `evaluateAllConditions` will process each condition one by one. For each condition:

1. It will fetch the latest data for the given `site` and `device` from the database.
2. Once the latest data is fetched, it will evaluate whether that data satisfies the given condition (using `evaluateSingleCondition` function).

However, the output will largely depend on the actual data in the database (`your_table_name`) at the time the function is executed. 

Here's a simplified breakdown of the logic:

- Check if the latest data for the `temp` sensor in the `kitchen` with device `00002` has a value `>= 12`
- AND check if its value is `<= 23`
- OR check if its value is `>= 20` (This OR logic might lead to always true for this block since any value between 12 to 23 will satisfy the next condition too)
- AND check if its value is `<= 34` (This is paired with the above OR, so effectively it checks if the value is between 20 and 34)
- AND check if the latest data for the `light` actuator in the `hall` with device `00007` is `off`
- AND check if the latest data for the `temp` sensor in the `room1` with device `00004` has a value `>= 11`
- OR check if the latest data for the `gps` sensor in the `room2` with device `00005` is `2344`
- OR check if the latest data for the `light` actuator in the `room3` with device `00006` is `on`
- AND check if the latest data for the `vaccum` actuator in the `room3` with device `00008` is `off`
- OR check if the latest data for the `vaccum` actuator in the `garge` with device `00010` is `on`

In essence, the function will return `true` only if all the conditions with "AND" logic are met and at least one condition with "OR" logic is met. Otherwise, it will return `false`.

However, keep in mind that this is a logical interpretation. The real outcome will depend on the data in the RethinkDB at the time of query execution. If you need a sample output, you'd have to provide the sample data present in the database corresponding to these conditions.
 */


})


module.exports = router;