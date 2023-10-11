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

  let stremsNameList =[]
  try {

    await Stream.find({service_id:service_id} ,async(err,stream)=>{
      if(err){
        throw new Error(err)
      }
  
      if(stream &&  stream.length > 0){

       console.log('stream ', stream);

      

        for (let item of stream){

          console.log('mame ', item)

          stremsNameList.push({stream:item.streamName,scene:item.sceneName,conditions:item.conditions})

        }

        if(stremsNameList && stremsNameList.length > 0){

          // console.log('stremsNameList ', stremsNameList)
          await Scene.find({service_id:service_id},{_id:0}, async(err,scene)=>{
            if(err){
                throw new Error(err)
            }
        
            if(scene.length!==0){
        
              //  console.log('scene ', scene)
        
          
                   res.status(200).json({streams:stremsNameList,
                    scenes:scene})
         
        
                
               
            }
         }).clone().catch(function (err) {console.log(err)})
        
        }
     

       
        
      }else {


        // if it did not find any automation only get list of scences and then return them for creating new conditoins

        await Scene.find({service_id:service_id},{_id:0}, async(err,scene)=>{
          if(err){
              throw new Error(err)
          }
      
          if(scene.length!==0){
        
                 res.status(200).json({scenes:scene})
             
          }else {
            res.status(204).json({msg:"There is no any scence, please go to scence page and create at least one scene"})
          }
       }).clone().catch(function (err) {console.log(err)})
      

      }
  
    }).clone().catch(function (err) {console.log(err)});
    
  } catch (error) {

    console.error('error ', error);
    
  }

// console.log('service_id in stream part ', service_id);
 

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

router.post("/stream/newcondition",async (req, res)=>{

  const service_id=req.body.id



  const scene = req.body.scene;
  const stream = req.body.stream;

  const conditionsTable = req.body.conditions
  

  

try {
  await Stream.find({service_id:service_id}, async(err,result)=>{
    if(err){
        throw new Error(err)
    }

    if(result.length===0){
      const newAutomation = new Stream({
        service_id:service_id,
      streamName:stream,
      sceneName:scene,
      conditions:conditionsTable,
        status: true,
      })

  await newAutomation.save().then(()=>{

    res.status(200).json({result:newAutomation
      ,msg:'new automation rule created successfully'})

  })
     
    }else if( result && result.length > 0){

      if(!result.some(item=>item.streamName===stream && stream.length>0 && scene.length >0 && conditionsTable.length > 0)){
        const newAutomation = new Stream({
        service_id:service_id,
        streamName:stream,
        sceneName:scene,
        conditions:conditionsTable,
          status: true,
        })
  
    await newAutomation.save().then(()=>{
  
      res.status(200).json({result:newAutomation
        ,msg:'new automation rule created successfully'})
  
    })
        
      }else {

        console.log('duplicate');
        res.status(409).json({name:stream,msg:"This name exist already"})

      }

        }
  }).clone().catch(function (err) {console.log(err)})
} catch (error) {
  console.error('error in create new rule ', error);
}


// table name is service_id
/**
 * 
 * Without .coerceTo('array'): The result of your query would be a sequence, which is essentially an iterable object. You'd typically have to loop over it to extract all the individual items.

With .coerceTo('array'): The result of your query is explicitly an array, allowing you to directly access items using indices or use array-specific operations.
 */


/**
 * 
 * 
 
const operandMapping = {
    'eq': '===',
    'lte': '<=',
    'lt': '<',
    'gte': '>=',
    'gt': '>',
    'ne': '!=='
};

async function fetchLatestDataForCondition(condition) {
    // Sample: Simulating fetching data for a given condition from the DB.
    // In real-world usage, replace this with your actual RethinkDB query.
    return {
        site: condition.site,
        device: condition.device,
        part: condition.part === 'sensor' ? condition.sensor : condition.actuator,
        name: condition.name,
        value: condition.value[Object.keys(condition.value)[0]]  // mock value
    };
}

function evaluateSingleCondition(data, condition) {
    const operand = operandMapping[Object.keys(condition.value)[0]];
    const checkValue = condition.value[Object.keys(condition.value)[0]];
    const evalString = `data.value ${operand} ${checkValue}`;
    return eval(evalString);
}

async function evaluateConditions(inputArray) {
    let results = [];

    for (let conditionsGroup of inputArray) {
        if (conditionsGroup.length === 1) {
            // OR condition
            let data = await fetchLatestDataForCondition(conditionsGroup[0]);
            results.push(evaluateSingleCondition(data, conditionsGroup[0]));
        } else {
            // AND condition
            let andResults = [];
            for (let condition of conditionsGroup) {
                let data = await fetchLatestDataForCondition(condition);
                andResults.push(evaluateSingleCondition(data, condition));
            }
            results.push(andResults.every(res => res === true));
        }
    }

    return results.includes(true);
}

// Usage example:
(async function() {
    const overallResult = await evaluateConditions(conditionsTable);
    console.log(overallResult);  // true if any group of conditions is met, false otherwise.
})();
 
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