
const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');
const mqtt = require('mqtt')
const axios =require('axios');


const { Kafka } = require('kafkajs');

function consumerKafka(){
    const kafka = new Kafka({
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
        brokers: ['localhost:9092']
      })

    const consumer = kafka.consumer({ groupId: 'babak.json' })
    const startConsumer = async () => {


        // Consuming
     await consumer.connect()
     await consumer.subscribe({ topic: 'babak.json', fromBeginning: true })
    
     await consumer.startConsumer({
       eachMessage: async ({ topic, partition, message }) => {
          
         console.log({
           partition,
           offset: message.offset,
           value: message.value.toString(),
         })
       },
     })
    
    }

    startConsumer().catch(console.error)
    
}







 



 module.exports={consumer:consumerKafka}