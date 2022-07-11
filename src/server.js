
const express = require('express')
const session = require('express-session');
var router = express.Router();
const bodyParser =require("body-parser");
const cookieParser =require("cookie-parser");
const path = require('path')
const morgan = require('morgan')
const rfs = require("rotating-file-stream");
const colors = require('colors');
const axios = require('axios');
const passport = require("passport");
require("./authentication/auth")(passport)
const bcrypt = require("bcrypt")
const mqtt = require('mqtt');
const cors = require('cors');
const nocache = require("nocache");
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
// const stompit = require('stompit')

const userAccount = require("./users/userAccount");
const dashbaord = require("./dashboard/dashboard");
const userFilter = require("./filter/userFilter");
const {v4:uuidv4} = require("uuid");
const receive = require('./transition/reciveData');


//* Apache ActiveMQ Artemis */
const subscriber = require('./broker/activemq/subscriber');
//* Apache ActiveMQ Artemis */


// Apache Kafka v3
/*
const producer = require('./broker/producer');
const kafkaProducer = producer.producer

const consumer = require('./broker/consumer');
const kafkaConsumer = consumer.consumer


  kafkaProducer().then(()=>{
   kafkaConsumer()
})

*/
// 




// Mongoose 
var sigmaBoardDB='mongodb://127.0.0.1:27017/sigmaboard';
// var filterBoardDB='mongodb://127.0.0.1:27017/filterboard';
// var mongoDB = "mongodb://mongoadmin:M_9qLvH4p1@127.0.0.1:27017/admin?authSource=admin&authMechanism=SCRAM-SHA-256"
try {
    mongoose.connect(sigmaBoardDB)
    // mongoose.createConnection(filterBoardDB)
   
} catch (error) {
  // handleError(error);
  console.error('mongoose error', error)
}

const db = mongoose.connection;
// const db2 = mongoose.connection;



db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log(colors.green(colors.bold("sigmaBoardDB")) + " Connected to MongoDB through mongoose successfully");
});

// db2.on("error", console.error.bind(console, "connection error: "));
// db2.once("open", function () {
//   console.log(colors.magenta(colors.bold("filterBoardDB"))+" Connected to MongoDB through mongoose successfully");
// });


var app = express();
// app.use(express.json())
// app.use(express.urlencoded({extended:false}));
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(session({
  secret:'udhfuw&^ET*G*WYGD#W&EHG@&(Y(SGH@*^W(UDBHy6',
  saveUninitialized:false,
  resave:false,
    store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1/cyprusSession',
    cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
  },
  }),


}));


app.use(cookieParser('udhfuw&^ET*G*WYGD#W&EHG@&(Y(SGH@*^W(UDBHy6'));
// Add headers before the routes are defined

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {

  const allowedOrigins = ['http://194.5.195.11:3088','http://194.5.195.11:5984','http://194.5.195.11:8082','http://194.5.195.11:8088'];
  const origin = req.headers.origin;
 
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Website you wish to allow to connect
  // res.setHeader("Access-Control-Allow-Origin", "http://194.5.195.11:3088");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");

  // Request headers you wish to allow
  //  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type,X-Auth-Token");
  res.header("Access-Control-Allow-Headers", "*");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // res.setHeader("Access-Control-Max-Age", "10")

  // Pass to next layer of middleware
  next();
});







var whitelist = ['http://194.5.195.11:3088','http://194.5.195.11:5984','http://localhost:3088','http://194.5.195.11:8082','http://194.5.195.11:8088'];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },

  credentials:true,
  preflightContinue:false,

}
app.use(nocache())
app.use(cors(corsOptions))



app.use('/broker',receive);
app.use('/',userAccount,dashbaord,userFilter);










// // create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '../logs')
  })
  
  // // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }))





  

var checkAuthenticated = function (req, res, next){
    console.log('req.isAuthenticated is ', req.isAuthenticated())
      if (req.isAuthenticated())
       {
          return next()
      }
    }
app.use(checkAuthenticated);






// Handle GET requests to /api route
app.post("/", (req, res,) => {
  res.json({ message: "Hello from server!" });
  // console.log('req form front ',req)

});

// app.get("/", (req, res) => {
//   res.json({ message: "Hello from server!"});
//   console.log('req form front ',req.isAuthenticated())

// });

const PORT = process.env.PORT || 3080;
app.listen(PORT, console.log(colors.bgMagenta(`Cyprus Server started on port ${PORT}`)));