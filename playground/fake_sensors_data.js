const sampleData = {
    atr: {
      device: '00001',
      timedate: new Date().toISOString()
    },
    data: [
      { sensor: '00001', name: 'temp', value: 20 },
      { sensor: '00002', name: 'lux', value: 110 },
      { sensor: '00003', name: 'pressure', value: 1110 },
      { sensor: '00004', name: 'pressure', value: 1330 },
      { sensor: '00005', name: 'lux', value: 25 },
      { sensor: '00006', name: 'temp', value: 14 },
      { sensor: '00007', name: 'lux', value: 29 }
    ]
  };
  
  // Function to generate a random number within a specified range
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  // Function to update the device name and randomize sensor values
  function updateData() {
    // Update the device name
    const currentDeviceNumber = parseInt(sampleData.atr.device.slice(-5));
    let nextDeviceNumber;
  
    if (currentDeviceNumber < 10) {
      nextDeviceNumber = currentDeviceNumber + 1;
    } else {
      nextDeviceNumber = 1;
    }
  
    sampleData.atr.device = `00000${nextDeviceNumber}`.slice(-5);
  
    // Randomize sensor values
    sampleData.data.forEach(sensor => {
      if (sensor.name === 'pressure') {
        sensor.value = getRandomNumber(1000, 2000);
      } else if (sensor.name === 'lux') {
        sensor.value = getRandomNumber(20, 100);
      } else if (sensor.name === 'temp') {
        sensor.value = getRandomNumber(10, 50);
      }
    });
  
    // Randomly duplicate the device name
    if (Math.random() < 0.3) {
      const duplicateSensor = sampleData.data.find(sensor => sensor.name === 'pressure');
      duplicateSensor.sensor = sampleData.data.find(sensor => sensor.name === 'lux').sensor;
    }
  
    // Print the updated data
    console.log(sampleData);
  }
  
  // Update the data every 40 seconds (40000 milliseconds)
  setInterval(updateData, 5000);
  