const express = require('express');
var router = express.Router();
const colors = require('colors');
const mqtt = require('mqtt')

async function activeMQPublisher(address,message){

  console.log('user in activeMQPublisher' , req.user.username)

const host = '194.5.195.11'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'artemis',
  password: 'A_4281Rtemis7928',
  reconnectPeriod: 1000,
  // customHandleAcks: function(topic, message, packet, done) {console.log('packet',topic)}
})



const topic = `${address}`

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], (err) => {
    if(!err){
      client.publish(topic, `${message}`, { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    }
  })
  /// send message to Babak device in Cyprus!

  


})



}


module.exports={
  mqPublisher:activeMQPublisher
}