// const { MongoClient } = require("mongodb");



// async function listCollectionsForDb(db, dbName) {
//     const collections = await db.listCollections({}, { nameOnly: true }).toArray();
//     if (collections.length) {
//         console.log(`Database ${dbName} has the following collections:`);
//         collections.forEach(col => console.log(col.name));
//     } else {
//         console.log(`Database ${dbName} has no collections.`);
//     }
// }

// // Connection URLs
// const url1 = 'mongodb://127.0.0.1:27017/';
// const url2 = 'mongodb://127.0.0.1:29019/';

// // Create new MongoClient objects
// const client1 = new MongoClient(url1);
// const client2 = new MongoClient(url2);

// // List of database names for client1
// const dbNames1 = [
//     'sigmaboard', 'filterboard', 'service', 'agent', 'client',
//     'users', 'device', 'scene', 'stream', 'sensor', 'actuator'
// ];

// // Database name for client2
// const dbNames2 =[ 'total'];

// // Object to hold the DB connections
// const dbConnections = {};

// async function initializeConnections() {
//     try {
//         // Connect to MongoDB servers
//         await client1.connect();
//         await client2.connect();

//         // Create DB connections for client1
//         for (let dbName of dbNames1) {
//             const db = client1.db(dbName);
//             dbConnections[dbName + 'DB'] = db;
//             // await listCollectionsForDb(db, dbName);
//         }

//         // Create DB connection for client2
//         for (let dbName of dbNames2) {
//             const db = client2.db(dbName);
//             dbConnections[dbName + 'DB'] = db;
//         }
       

//         console.log("Connected to all databases successfully.");

//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//     }
// }




// initializeConnections();



// module.exports = {
//     dbConnections,
//     initializeConnections
// };