router.post("/stream/getdata", checkAuthenticated, async (req, res) => {
    try {
       const service_id = req.body.id;
      //  console.log('service_id in stream part ', service_id);
   
       const devices = await Device.findOne({ service_id: service_id }, { _id: 0 });
   
       if (devices) {
         console.log('result ', devices);
   
         const deviceSitesNameList = devices.some(element => element.site && element.site !== '');
   
         if (deviceSitesNameList) {
           res.status(200).json({ devices: devices });
         } else {
           res.status(404).json({ message: "No device sites found" });
         }
       } else {
         res.status(404).json({ message: "No devices found for the given service ID" });
       }
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: "Internal Server Error" });
     }
   
   
   })
   