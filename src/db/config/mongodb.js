const express =require("express");
var router = express.Router();
const {MongoClient} =require("mongodb");
const colors = require("colors");

// //Connect to MongoDB
const url = 'mongodb://127.0.0.1:27017';
// const url2 = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/?authSource=admin";
const client = new MongoClient(url);
// // Database Name
const dbName = 'sigmaboard';
const dbName2 = 'filterboard';
// // const dbName = 'admin';
// // Use connect method to connect to the server

async function main(){
    await client.connect();
    console.log(colors.cyan(`${dbName} Connected successfully to server`));
    console.log(colors.blue(`${dbName2} Connected successfully to server`));
    
}
main()
 const sigmaBoardDB = client.db(dbName);
 const filterBoardDB = client.db(dbName2)

module.exports=  {sigmaBoardDB: sigmaBoardDB,
    filterBoardDB:filterBoardDB};



