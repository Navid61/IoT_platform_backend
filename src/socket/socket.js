// socket.js
let io
var whitelist = ['http://49.12.212.20:3080','http://49.12.212.20:3000','http://49.12.212.20:3088','http://49.12.212.20:5984','http://localhost:3088','http://49.12.212.20:8082','http://49.12.212.20:8088']
const { Server } = require('socket.io');
module.exports = {
  init: (server) => {
    
    io = new Server(server, {
      cookie: {
        name: "sigmaboard",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 86400
      },
        cors: {
            origin: whitelist,
            allowedHeaders: ["content-type"],
            methods: ["GET", "POST"],
            credentials: true
          }
    });

      // Set up the namespace
       
    return io;
  },
  getIO: (namespace = '') => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    
    if (namespace) {
      return io.of(namespace);
    }
    
    return io;
  },
};
