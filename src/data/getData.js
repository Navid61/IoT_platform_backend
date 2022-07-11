const router = require('express').Router()
const axios = require("axios");


async function getData(zone,db){


    async function getLatestDocValue(docid){

      // const sensorsSerialsNumber=[]
        const result =  await axios({
            method:"GET",
            url:`http://localhost:5984/cyprus-dev/${docid}`,
            withCredentials:true,
            maxBodyLength:Infinity,
            headers:{
              'content-type':'application/json',
              'accept':'application/json'
            },
            auth:{
              username:'admin',
              password:'c0_OU7928CH'
        
            },
        
          }).then((response)=>{
     
      const sensorsList = response.data.dashboard
      
    
        return sensorsList
     
               
      }).catch(error=>{
           console.error('error in get couchdb docid', error)
      })
 
      return result
 }
 

  
    try {
      const filterSampleTemplate =  await axios({
           method:"GET",
           url:`http://localhost:5984/${db}/_changes?descending=true&limit=1`,
           withCredentials:true,
          
           headers:{
             'content-type':'application/json',
             'accept':'application/json'
           },
           auth:{
             username:'admin',
             password:'c0_OU7928CH'
       
           },
       
         }).then(async(response)=>{
     
        if(response.data.results[0].id){
         
          const docid=response.data.results[0].id
          console.log('recent doc id ', docid)

        return await getLatestDocValue(docid).then((result)=>{
            return result
         })
     
        }
        
         }).catch(error=>{
           console.error('error in receiving data precedure from Couchdb ', error)
         })

       return filterSampleTemplate
         
       } catch (error) {
         console.error('error from axios in getData section',error)
       }
     
     
     
     



}



module.exports = {getData:getData}