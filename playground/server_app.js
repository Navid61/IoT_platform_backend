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