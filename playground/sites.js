// router.post('/sites/create', checkAuthenticated, async (req, res) => {

// console.log('req.body ', req.body)
// const service_id=req.body.service_id
// const values=req.body.values

//     // await Service.find({owner:req.user.username,service_id:service_id},async(err,result)=>{
//     //     if(err){
//     //         throw new Error('err in get owner name in device')
//     //     }

//     //     if(result.length!==0){

//     //         await Device.find({service_id:service_id},async(err,result)=>{
//     //             if(err){
//     //                 throw new Error(err)
//     //             }

//     //             if(result.length===0){

//     //                 (async()=>{

//     //                     return await deviceDB.collection("devices").insertOne({service_id:service_id,device:values})

//     //                 })().then((response)=>{
//     //                     if(response){
//     //                         res.status(201).json({status:201,msg:"ok"})
//     //                     }
//     //                 })

//     //             }
//     //             // else if(result.length!==0){

//     //             //     if(result[0].device.length !==0){
//     //             //         console.log('result in devices ', result)

//     //             //         try{
//     //             //            await deviceDB.collection("devices").findOneAndUpdate({service_id:service_id},{$set:{device:req.body.values}})
//     //             //             res.status(204).json({status:204,msg:"updated"})
//     //             //         }catch(e){
//     //             //             res.status(400).json({status:400,msg:e})
//     //             //         }
//     //             //     }

//     //             // }

//     //         }).clone()
//     // .catch(function (err) {
//     //   console.log(err)
//     // })

//     //     }else{
//     //         res.status(401).json({msg:'Error Service Not found'})
//     //     }
//     // }).clone()
//     // .catch(function (err) {
//     //   console.log(err)
//     // })

// })