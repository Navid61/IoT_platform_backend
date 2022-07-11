let sensor_data={
    "_id":data[i].sensor_id + `:sensor-reading-${uuidv4()}`,
    "sensor_id":data[i].sensor_id,
    "name":data[i].name,
    "value":data[i].value,
  }
