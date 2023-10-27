// @ts-nocheck
var express = require("express");
const session = require("express-session");

var router = express.Router();
const socketIo = require("socket.io");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const colors = require("colors");
const axios = require("axios");
const passport = require("passport");
require("./authentication/auth")(passport);
const bcrypt = require("bcrypt");
const mqtt = require("mqtt");
const cors = require("cors");
const nocache = require("nocache");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
// const stompit = require('stompit')

const userAccount = require("./users/userAccount");
const users = require("./users/users");
const device = require("./device/device");
const sites = require("./sites/sites");
const account = require("./account/account");
const dashbaord = require("./dashboard/dashboard");
const userFilter = require("./filter/userFilter");
const place = require("./place/place");
const stream = require("./stream/stream");

const usergroup = require("./users/usergroup");
const { v4: uuidv4 } = require("uuid");
const receive = require("./transition/reciveData");

const newService = require("./customer/newService");
const newClient = require("./client/newClient");
const sensors = require("./sensors/sensors");
const actuators = require("./actuator/actuator");
const scenes = require("./scene/scene");

// for real-time connection

const socket = require("./socket/socket");
const http = require("http");

/**
 * Test Your Application:
After setting the desired behavior, ensure you test your application thoroughly. If you set strictQuery to true, make sure all your queries only use fields defined in your Mongoose schemas. 
If you set it to false, be aware that fields not in the schema will be ignored when creating or updating documents but not when querying.

By setting the strictQuery option explicitly as per your needs, you're not only preparing your application for future Mongoose versions but also ensuring that your queries behave as expected.
 */
//

mongoose.set("strictQuery", true);

//* Apache ActiveMQ Artemis */
const subscriber = require("./broker/activemq/subscriber");
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



var app = express();

let whitelist = [
  "http://49.12.212.20:3080",
  "http://49.12.212.20:3000",
  "http://49.12.212.20:3088",
  "http://49.12.212.20:5984",
  "http://localhost:3088",
  "http://49.12.212.20:8082",
  "http://49.12.212.20:8088",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
  preflightContinue: false,
};

app.use(cors(corsOptions));
// No Cache middleware (to prevent back button after logout)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//for real-time connection

const server = http.createServer(app);

const io = socket.init(server);

io.on("connect_error", (error) => {
  console.log("Connection Error", error);
});

//

//parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ limit:'50mb', extended: false }));
// parse application/json
// app.use(bodyParser.json({limit:'50mb'}));
const sessionMiddleware = session({
  secret: "udhfuw&^ET*G*WYGD#W&EHG@&(Y(SGH@*^W(UDBHy6",
  saveUninitialized: false,
  resave: false,
  store: MongoStore.create({
    mongoUrl: "mongodb://127.0.0.1/cyprusSession",
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    },
  }),
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.use(cookieParser("udhfuw&^ET*G*WYGD#W&EHG@&(Y(SGH@*^W(UDBHy6"));
// Add headers before the routes are defined
app.use(sessionMiddleware);
// PASSPORT
app.use(passport.initialize());
app.use(passport.session());

io.use((socket, next) => {
  passport.initialize()(socket.request, {}, () => {
  passport.session()(socket.request, {}, next);
  });
});

// app.use(function (req, res, next) {

//   // console.log('for debugging req requst in nodejs',req.body);

//   const allowedOrigins = ['http://49.12.212.20:3080','http://49.12.212.20:3000','http://49.12.212.20:3088','http://49.12.212.20:5984','http://49.12.212.20:8082','http://49.12.212.20:8088'];
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//        res.setHeader('Access-Control-Allow-Origin', origin);
//   }

//   // Website you wish to allow to connect
//   // res.setHeader("Access-Control-Allow-Origin", "http://49.12.212.20:3088");

//   // Request methods you wish to allow
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");

//   // Request headers you wish to allow
//   //  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type,X-Auth-Token");
//   res.header("Access-Control-Allow-Headers", "*");

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader("Access-Control-Allow-Credentials", true);

//   // res.setHeader("Access-Control-Max-Age", "10")

//    // Set Cache-Control header
//    res.setHeader('Cache-Control', 'max-age=3600');  // Cache for 1 hour

//   // Pass to next layer of middleware
//   next();
// });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use(nocache());
app.use("/broker", receive);
app.use(
  "/",
  userAccount,
  users,
  dashbaord,
  userFilter,
  newService,
  newClient,
  account,
  place,
  device,
  sites,
  usergroup,
  sensors,
  actuators,
  scenes,
  stream
);

// // create a rotating write stream
var accessLogStream = rfs.createStream("access.log", {
  interval: "7d", // rotate daily
  path: path.join(__dirname, "../logs"),
});

// // setup the logger
app.use(morgan("combined", { stream: accessLogStream }));

var checkAuthenticated = function (req, res, next) {
  // console.log('req.isAuthenticated in server is ', req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next();
  }
};
app.use(checkAuthenticated);

io.use((socket, next) => {
  if (socket.request.isAuthenticated()) {
    return next();
  }
  return next(new Error("Authentication Error"));
});

const PORT = process.env.PORT || 3080;
server.listen(
  PORT,
  console.log(colors.bgMagenta(`Cyprus Server started on port ${PORT}`))
);
