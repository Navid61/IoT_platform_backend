
const socket = require('../../socket/socket');
const events = require('events');

const eventEmitter = new events.EventEmitter();
let lastRealTimeData = null;
router.get("/device/:id", async (req, res) => {
    const serviceId = req.params.id;
    const userName = req.user.username;
  console.log('serviceId ', serviceId);
    let io = socket.getIO(); // Obtain the socket.io instance here
    const deviceNamespace = io.of(`/device/${serviceId}`); // Use serviceId instead of id
  
    deviceNamespace.emit("refreshData");
  
    // Check if the listeners are already attached to prevent duplicates
    if (!deviceNamespace._events || !deviceNamespace._events.connection) {
      deviceNamespace.on('connection', (socket) => {
        socket.on("service_id", handleRealTimeData);
        socket.on("disconnect", () => {});
      });
    }
  
    function handleRealTimeData(data) {
      lastRealTimeData = data;
      eventEmitter.emit('newRealTimeData', data);
    }
  
    eventEmitter.once('newRealTimeData', (data) => {
      console.log(data);
    });
  
    if (lastRealTimeData) {
      console.log(lastRealTimeData);
    }
  
    try {
      const serviceInfo = await Service.find({
        owner: userName,
        service_id: serviceId, // Use serviceId here
      }).clone().catch(function (err) {
        console.log(err);
      });
  
      if (serviceInfo && serviceInfo.length > 0) {
        const deviceResult = await Device.find({ service_id: serviceId }).clone().catch(function (err) {
          console.error('device finding procedure has a problem ', err);
        });
  
        
  
        if (deviceResult && deviceResult.length > 0) {
   // Respond back to the client
          deviceNamespace.emit("/realtime/devices", {
            devices: deviceResult[0].device,
            site: deviceResult[0].site,
          });
         
          res.status(200).json({
            devices: deviceResult[0].device,
            site: deviceResult[0].site,
          });
        } else {
          res.status(404).json({ message: "No device found" });
        }
      } else {
        res.status(404).json({ message: "No service found" });
      }
    } catch (error) {
      console.error("Error in device method", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  