const express =require("express");
var router = express.Router();
const {MongoClient} =require("mongodb");
const colors = require("colors");

// //Connect to MongoDB
const url = 'mongodb://127.0.0.1:27017';
// const url2 = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/?authSource=admin";
const client = new MongoClient(url);
// // Database Name
const dbName ='sigmaboard';
const dbName2 ='filterboard';
const dbName3 ='service';
const dbName4 ='agent';
const dbName5 ='client';
const dbName6='users';
const dbName7='device';
// // const dbName = 'admin';
// // Use connect method to connect to the server

async function main(){
    await client.connect();
   
}
main()
 const sigmaBoardDB = client.db(dbName);
 const filterBoardDB = client.db(dbName2)
 const serviceDB = client.db(dbName3)
 const agentDB = client.db(dbName4)
 const clientDB = client.db(dbName5)
 const usersDB = client.db(dbName6)
 const deviceDB= client.db(dbName7)

module.exports={
    sigmaBoardDB:sigmaBoardDB,
    filterBoardDB:filterBoardDB,
    serviceDB:serviceDB,
    agentDB:agentDB,
    clientDB:clientDB,
    usersDB:usersDB,
    deviceDB:deviceDB
};


