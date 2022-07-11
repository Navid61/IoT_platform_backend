const express = require('express')
const session = require('express-session');
var router = express.Router();

const colors = require('colors');
const mqtt = require('mqtt')
const axios =require('axios');


const { Kafka } = require('kafkajs');

function producerKafka(){


    const host = '194.5.195.11'
    const port = '1883'
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`


    const connectUrl = `mqtt://${host}:${port}`
    const client = mqtt.connect(connectUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    //   customHandleAcks: function(topic, message, packet, done) {console.log('packet',topic)}
    })

    const topic = '/babak/json'

    client.on('connect', () => {
        console.log('Connected')
        client.subscribe([topic], () => {
          console.log(`Subscribe to topic in Kafka '${topic}'`)
        })
    })


  
       

    const kafka = new Kafka({
        clientId: clientId,
      
        brokers: ['localhost:9092']
      })
      
      const producer = kafka.producer()
    
      
      const startProducer = async () => {
        // Producing
        await producer.connect()

       
/*
//How to send multi topics
        const messages =[
          {
            topic:'topic-a',
            messages:[
              {
                key:'key1',
                value:'Hello from kafka first topic'
              }
            ]
          },
          {
            topic:'topic-b',
            messages:[
              {
                key:'key2',
                value:'Hello from kafka second topic'
              }
            ]
          }
        ]

        // await producer.sendBatch({topicMessages:messages })
*/

        client.on('message', async(topic, payload) => {
            console.log('payload ', JSON.parse(payload.toString())["office"] )
            await producer.send({
                topic: 'babak',
                messages: [
                  { value: payload.toString()},
                ],
              })
           
        })
       
      
       
      }
      
      startProducer().catch(console.error)

}





module.exports={producer:producerKafka}