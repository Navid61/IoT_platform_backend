  let filterResult =[]
  try {
   await axios({
      method:"GET",
      url:'http://localhost:5984/cyprus-dev/_changes?feed=longpoll&descending=true&limit=1',
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
    //  console.log('docide ', docid)
    await getLatestDocValue(docid)

   }
   
    }).catch(error=>{
      console.error('error in received data from couchdb ', error)
    })
    
  } catch (error) {
    console.error('error in trac catch /recevied data from CouchDB')
  }





  async function getLatestDocValue(docid){
    await axios({
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



filterResult.push(response.data)



  if(response.data.office){
   console.log('response ',colors.green(new Date(response.data.office[0].time).toLocaleString()))
  
     res.status(200).json({office:response.data.office,
                     time:response.data.office[0].time})
                    }
   

    



}).catch(error=>{
     console.error('error in get couchdb docid', error)
})
  }







  /// ActiveMQ


   
 // console.log(json["office1"])
//   for(let i=0;i<json["office1"].length;i++){
//   //  console.log('json[office1] ', json["office1"])
//   // "_id":`${json["office1"][i].sensor_id}:`+ `${uuidv4()}`,
//   //  const doc={
//   //   "_id":`${json["office1"][i].sensor_id}:`+ `${uuidv4()}`,
//   //   "sensor_id":`${json["office1"][i].sensor_id}`,
//   //   "reading":[new Date().toISOString(),Math.random(100)]

//   // }

//   // console.log('doc ', doc)

// // Confilict

//   // await axios({
//   //     method:"GET",
//   //     url:'http://localhost:5984/cyprus-dev/?conflicts=true',
//   //    withCredntials:true,

//   //     headers:{
//   //       'content-type':'application/json',
//   //       'accept':'application/json'
//   //     },
//   //     auth:{
//   //       username:'admin',
//   //       password:'c0_OU7928CH'

//   //     },
    
//   //   }).then((response=>{
//   //     console.log('response in confilict ', response.data)

//   //   })).catch(error=>{
//   //     console.error('error in confilict ', error)
//   //   })

//     // await axios({
//     //   method:"POST",
//     //   url:'http://localhost:5984/cyprus-dev',
//     //  withCredntials:true,

//     //   headers:{
//     //     'content-type':'application/json',
//     //     'accept':'application/json'
//     //   },
//     //   auth:{
//     //     username:'admin',
//     //     password:'c0_OU7928CH'

//     //   },
//     //   data:doc
//     // }).then((response)=>{
//     //   console.log('response form put doc into couchDB ', response.data)
//     // }).catch(error=>{
//     //   console.error('error in put doc to couchDB ', error)
//     // })

//   }

  // if(json["office2"]){
//   for(let i=0;i<json["office2"].length;i++){
//     // console.log('json[office2] ', json["office2"][i])
//     await axios({
//       method:"POST",
//       url:'http://localhost:5984-dev',
//      withCredntials:true,

//       headers:{
//         'content-type':'application/json',
//         'accept':'application/json'
//       },
//       auth:{
//         username:'admin',
//         password:'c0_OU7928CH'

//       },
//       data:json["office2"][i]
//     })

//   }
// }
 