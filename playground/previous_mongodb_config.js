const express =require("express");
var router = express.Router();
const {MongoClient} =require("mongodb");
const colors = require("colors");

// //Connect to MongoDB
 const url = 'mongodb://127.0.0.1:27017';
 const url2='mongodb://127.0.0.1:29019';
// const url = 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019';
// const url2 = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/?authSource=admin";
const client = new MongoClient(url);

const entireData = new MongoClient(url2);


// // Database Name
const dbName ='sigmaboard';
const dbName2 ='filterboard';
const dbName3 ='service';
const dbName4 ='agent';
const dbName5 ='client';
const dbName6='users';
const dbName7='device';
const dbName8='scene';
const dbName9='stream';
const dbName10='sensor';
const dbName11='actuator';
//

const dbName70='totaldata';

// // const dbName = 'admin';
// // Use connect method to connect to the server

async function main(){
    await client.connect();
    await entireData.connect();
   
}
main()
 const sigmaBoardDB = client.db(dbName);
 const filterBoardDB = client.db(dbName2);
 const serviceDB = client.db(dbName3);
 const agentDB = client.db(dbName4);
 const clientDB = client.db(dbName5);
 const usersDB = client.db(dbName6);
 const deviceDB= client.db(dbName7);
 const sceneDB = client.db(dbName8);
 const streamDB = client.db(dbName9);
 const sensorSiteDB = client.db(dbName10);
 const actuatorSiteDB =client.db(dbName11);

 // all sensor and actuator data store in other database if user defined device site
 const totalDB = entireData.db(dbName70);


module.exports={
    sigmaBoardDB:sigmaBoardDB,
    filterBoardDB:filterBoardDB,
    serviceDB:serviceDB,
    agentDB:agentDB,
    clientDB:clientDB,
    usersDB:usersDB,
    deviceDB:deviceDB,
    sceneDB:sceneDB,
    streamDB:streamDB,
    sensorSiteDB:sensorSiteDB,
    actuatorSiteDB:actuatorSiteDB,
    totalDB:totalDB
   
};