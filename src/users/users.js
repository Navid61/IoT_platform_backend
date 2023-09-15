const express = require("express");

const router = express.Router();

const Account= require('../db/models/account');

const Users = require('../db/models/users');

const UserGroup = require('../db/models/usergroup');

const Service= require('../db/models/service');

const FilterRule = require("../db/models/filter")

const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB

const sigmaBoardDB = mongodb.sigmaBoardDB


const checkAuthenticated = function (req, res, next) {
   
  
    if (req.isAuthenticated()) {
      return next()
    }
  }
  
router.use(checkAuthenticated)

// router.post("/users", checkAuthenticated, async (req, res) => {


//     // if(req.body.task===205){
//     //     await Account.find({username:req.body.username},async(err,result)=>{
//     //         if(err){
//     //             throw new Error(err)
//     //         }
    
    
//     //         if(result.length!==0){
          
//     //             if(result[0].username===req.body.username && result[0].verification === true){

                    

//     //                 await checkDuplicateServiceID()
                    
                    
//     //             }
               
//     //         }
//     //     }).clone()
//     //     .catch(function (err) {
//     //       console.log(err)
//     //     })


//     //     async function checkDuplicateServiceID(){
//     //         await Users.find({username:req.body.username,service_id:req.body.service_id},async(err,result)=>{

//     //             if(err){
//     //                 throw new Error(err)
//     //             }

//     //             if(result.length!==0){
                   
//     //                     res.status(409).json({
//     //                         status:409,
//     //                         msg:`Conflict,${req.body.username} created in ${req.body.service_id} already`})
                       
//     //                 }else{
//     //                     res.status(200).json({
//     //                         status:200,
//     //                         msg:"ok"})
//     //                 }

               

//     //         }).clone()
//     //         .catch(function (err) {
//     //           console.log(err)
//     //         })

//     //     }
    

//     // }

//     // if(req.body.task===201){

//     // // console.log('no new user create new user')

    

//     //     await Service.find({owner:req.body.username,service_id:req.body.service_id},async(err,result)=>{
//     //         if(err){
//     //             throw new Error('error in check user exist as a owner before create new user')
//     //         }
    
   
//     //             if(result.length ===0){
             
//     //                     await Users.find({username:req.body.username,service_id:req.body.service_id},async(err,result)=>{
//     //                         if(err){
//     //                             throw new Error('error in users find before create new user')
//     //                         }

//     //                         if(result.length===0){

//     //                             await usersDB.collection("users").insertOne({
//     //                                 username:req.body.username,
//     //                                 service_id:req.body.service_id,
//     //                                 role:req.body.role,
//     //                                 adddate:new Date().toISOString()
                        
//     //                             }).then(()=>{
//     //                                 res.status(200).json({msg:"ok"})
//     //                             })
                              
                                    
                            
                                

//     //                         }else{
//     //                             res.status(409).json({msg:"Confilict! user created already"})
//     //                         }

//     //                     }).clone().catch(function (err) {console.log(err)})
                
  
                   
    
//     //             }else{
//     //                 res.status(403).json({msg:"Forbiden user"})
//     //             }
           
//     //     }).clone().catch(function (err) {console.log(err)})
    


  

      

//     // }

//     // if(req.body.task===204){
      
//     //     const updateQue=req.body.update
     
//     //     if(updateQue.length!==0){
//     //         try{
//     //             for(let u=0;u<updateQue.length;u++){

//     //                 (async()=>{
//     //                     await  usersDB.collection("users").findOneAndUpdate({username:updateQue[u].user,service_id:req.body.service_id},{$set:{"role":updateQue[u].role}})

//     //                 })().then(()=>{
//     //                     (async()=>{
//     //                         await Users.find({service_id:req.body.service_id,username:updateQue[u].user},async(err,result)=>{
//     //                             if(err){
//     //                                 throw new Error(err)
//     //                             }
            
//     //                             if(result.length!==0){
//     //                                 if(result[0].role==='admin' || result[0].role==='owner' ){
//     //         // console.log('result ', result[0])
//     //                                     await usersDB.collection("usergroups").updateOne({service_id:req.body.service_id,group:{$elemMatch:{user:result[0].username}}},{$pull:{group:{user:result[0].username}}})
            
//     //                                 }
            
//     //                             }
//     //                           }).clone().catch(function (err) {console.log(err)})
    
//     //                     })()

//     //                 })
   

                    
                   
                  
 
//     //             }

//     //             res.status(204).json({msg:"Update Successfully"})
               

//     //         }catch(e){
//     //             console.error('error in update user access level')
//     //         }

//     //     }
       
//     // }


// //     if(req.body.task==='remove'){
// // let removeUsersList =req.body.users

// // const service_id = req.body.service_id




// // if(removeUsersList.length > 0){

// //     (async()=>{
// //         for await (const i of removeUsersList){

// //             // await usersDB.collection("usergroups").updateOne({service_id:service_id},{$pull:{group:{user:i.user}}})

// //             (async(i)=>{
// //                 await Users.find({username:i.user,service_id:req.body.service_id},async(err,result)=>{
         
// //                          if(err){
// //                              throw new Error('error in get remove users list')
// //                          }
             
// //                          if(result.length!==0){
// //                             // console.log('result ', result)
// //                              for(let j =0 ; j<result.length;j++){
                              
// //                                    (async(j)=>{
// //                                      await usersDB.collection("users").deleteOne({username:result[j].username,service_id:result[j].service_id})
// //                                      // REMOVER USER FROM ITS GROUP ALSO
// //                                      await usersDB.collection("usergroups").updateOne({service_id:result[j].service_id},{$pull:{group:{user:result[j].username}}})
// //                                    })(j)
                                 
// //                                 }
             
// //                          }
             
                   
             
                        
                     
// //                      }).clone().catch(function (err) {console.log(err)})
             
// //                  })(i)
    
// //         }
// //         return true
// //     })().then((response)=>{
// //         if(response){
// //             console.log('res in remove ', response)

            
// //             res.status(200).json({
// //                 status:200,
// //                 removed:removeUsersList,
// //                 msg:'done'})
// //         }
        
// //     })

   
// //     // for(let i=0;i<removeUsersList.length;i++){

// //     //     (async(i)=>{
// //     //    await Users.find({username:removeUsersList[i].user,service_id:req.body.service_id},async(err,result)=>{

// //     //             if(err){
// //     //                 throw new Error('error in get remove users list')
// //     //             }
    
// //     //             if(result.length!==0){
// //     //                 for(let j =0 ; j<result.length;j++){
                     
// //     //                       (async(j)=>{
// //     //                         await usersDB.collection("users").deleteOne({username:result[j].username,service_id:result[j].service_id})
// //     //                       })(j)
                        
// //     //                    }
    
// //     //             }
    
          
    
               
            
// //     //         }).clone().catch(function (err) {console.log(err)})
    
// //     //     })(i)
           
        
// //     // }

   
   
// // }









  

// //     }


   
  

   

    


// })


router.post("/users/dupuser", checkAuthenticated, async (req, res) => {

  const service_id=req.body.service_id
  const username = req.body.username
  
    await Account.find({username:req.body.username},async(err,result)=>{
        if(err){
            throw new Error(err)
        }


        if(result.length!==0){
      
            if(result[0].username===req.body.username && result[0].verification === true){

                

                await checkDuplicateServiceID()
                
                
            }
           
        }
    }).clone()
    .catch(function (err) {
      console.log('Duplicate service ID error ', err)
    })


    async function checkDuplicateServiceID(){
        await Users.find({username:req.body.username,service_id:req.body.service_id},async(err,result)=>{

            if(err){
                throw new Error(err)
            }

            if(result.length!==0){
               
                    res.status(409).json({
                        status:409,
                        msg:`Conflict,${req.body.username} created in ${req.body.service_id} already`})
                   
                }else{
                    res.status(200).json({
                        status:200,
                        msg:"ok"})
                }

           

        }).clone()
        .catch(function (err) {
          console.log(err)
        })

    }




})

router.post("/users/adduser", checkAuthenticated, async (req, res) => {
  const service_id=req.body.service_id
  const username = req.body.username
  const role=req.body.role

    // console.log('no new user create new user')
  try {

    await Service.find({owner:username,service_id:service_id},async(err,result)=>{
      if(err){
          throw new Error('error in check user exist as a owner before create new user')
      }


          if(result.length ===0){
       
                  await Users.find({username:username,service_id:service_id},async(err,result)=>{
                      if(err){
                          throw new Error('error in users find before create new user')
                      }

                      if(result.length===0){

                          await usersDB.collection("users").insertOne({
                              username:username,
                              service_id:service_id,
                              role:role,
                              adddate:new Date().toISOString()
                  
                          }).then(()=>{
                              res.status(200).json({msg:"ok"})
                          })
                        
                              
                      
                          

                      }else{
                          res.status(409).json({msg:"Confilict! user created already"})
                      }

                  }).clone().catch(function (err) {console.log(err)})
          

             

          }else{
              res.status(403).json({msg:"Forbiden user"})
          }
     
  }).clone().catch(function (err) {console.log(err)})


    
  } catch (error) {
    console.error('error in add user', error);
  }
    
  
       
  
  
  
      
  
    
})

router.post("/users/updateuser", checkAuthenticated, async (req, res) => {
  const service_id=req.body.service_id
  const updateQue=req.body.update



      
   
     
        if(updateQue.length!==0){
            try{
                for(let u=0;u<updateQue.length;u++){

                    (async()=>{
                        await  usersDB.collection("users").findOneAndUpdate({username:updateQue[u].user,service_id:req.body.service_id},{$set:{"role":updateQue[u].role}})

                    })().then(()=>{
                        (async()=>{
                            await Users.find({service_id:req.body.service_id,username:updateQue[u].user},async(err,result)=>{
                                if(err){
                                    throw new Error(err)
                                }
            
                                if(result.length!==0){
                                    if(result[0].role==='admin' || result[0].role==='owner' ){
            // console.log('result ', result[0])
                                        await usersDB.collection("usergroups").updateOne({service_id:req.body.service_id,group:{$elemMatch:{user:result[0].username}}},{$pull:{group:{user:result[0].username}}})
            
                                    }
            
                                }
                              }).clone().catch(function (err) {console.log(err)})
    
                        })()

                    })
   

                    
                   
                  
 
                }

                res.status(204).json({msg:"Update Successfully"})
               

            }catch(e){
                console.error('error in update user access level')
            }

        }
       
    

  
    
  
  
  
      
  
    
})

router.post("/users/removeuser", checkAuthenticated, async (req, res) => {
  const service_id=req.body.service_id
  let removeUsersList =req.body.users

if(removeUsersList.length > 0){

    (async()=>{
        for await (const i of removeUsersList){

            // await usersDB.collection("usergroups").updateOne({service_id:service_id},{$pull:{group:{user:i.user}}})

            (async(i)=>{
                await Users.find({username:i.user,service_id:req.body.service_id},async(err,result)=>{
         
                         if(err){
                             throw new Error('error in get remove users list')
                         }
             
                         if(result.length!==0){
                            // console.log('result ', result)
                             for(let j =0 ; j<result.length;j++){
                              
                                   (async(j)=>{
                                     await usersDB.collection("users").deleteOne({username:result[j].username,service_id:result[j].service_id})
                                     // REMOVER USER FROM ITS GROUP ALSO
                                     await usersDB.collection("usergroups").updateOne({service_id:result[j].service_id},{$pull:{group:{user:result[j].username}}})
                                   })(j)
                                 
                                }
             
                         }
             
                   
             
                        
                     
                     }).clone().catch(function (err) {console.log(err)})
             
                 })(i)
    
        }
        return true
    })().then((response)=>{
        if(response){
            console.log('res in remove ', response)

            
            res.status(200).json({
                status:200,
                removed:removeUsersList,
                msg:'done'})
        }
        
    })

   

   
   
}









  


 



    

  
    
  
  
  
      
  
    
})






// get user name list data when user click on user group icon on filteration page
router.post("/users/getusersdata", checkAuthenticated, async (req, res) => {
    const service_id=req.body.service_id
    let userNameList = []

  try {

    await UserGroup.find({ service_id: service_id }, async (err, result) => {
      if (err) {
        throw new Error(err)
      }
  
      if (result.length === 0 || result[0].group.length === 0) {
        // WHEN THERE IS NOT ANY USER GROUOP
        await Users.find({ service_id: service_id }, async (err, result) => {
          if (err) {
            throw new Error(err)
          }
  
          if (result.length !== 0) {
          
            for (let i = 0; i < result.length; i++) {
              userNameList.push({
                username: result[i].username,
                role: result[i].role,
              })
            }
  
            await FilterRule.find(
              { service_id: service_id },
              async (err, result) => {
                if (err) {
                  throw new Error(err)
                }
  
                if (result) {
                  if (result.length !== 0) {
  
                   
                    res
                      .status(200)
                      .json({ username: userNameList, filters: result[0].rule })
                  } else {
                    res.status(200).json({username: userNameList })
                  }
                }
              }
            )
              .clone()
              .catch(function (err) {
                console.log(err)
              })
          }
        })
          .clone()
          .catch(function (err) {
            console.log(err)
          })
      } else {
  
      
        const userNameGroup = result[0].group
       
        let userNameInGroup = []
        let groupName = []
  
        for (let i = 0; i < userNameGroup.length; i++) {
          userNameInGroup.push(userNameGroup[i].user)
          groupName.push(userNameGroup[i].group)
        }
  
        const usersList = [...new Set(userNameInGroup)]
        const groupNameList = [...new Set(groupName)]
  
        await Users.find({ service_id: service_id }, async (err, result) => {
          if (err) {
            throw new Error(err)
          }
  
          if (result.length > 0) {
  
        
  
          
            for (let i = 0; i < result.length; i++) {
              if(result[i].role!=='admin' && result[i].role!=='owner'){
               
                userNameList.push({ username: result[i].username })
              }
             
            }
          }
  
          const filteredUserNameList = userNameList.filter((item) => {
            if (usersList.includes(item.username)) {
              return ""
            } else {
              return item
            }
          })
  
          await FilterRule.find(
            { service_id: service_id },
            async (err, result) => {
              if (err) {
                throw new Error(err)
              }
  
              if (result.length !== 0) {
                        // console.log('result in filter rule',filteredUserNameList)
  
                res
                  .status(200)
                  .json({
                    username: filteredUserNameList,
                    group: groupNameList,
                    usergroup: userNameGroup,
                    filters: result[0].rule,
                  })
              } else {
                res
                  .status(200)
                  .json({
                    username: filteredUserNameList,
                    group: groupNameList,
                    usergroup: userNameGroup,
                  })
              }
            })
            .clone()
            .catch(function (err) {
              console.log(err)
            })
        })
          .clone()
          .catch(function (err) {
            console.log(err)
          })
      }
    })
      .clone()
      .catch(function (err) {
        console.log(err)
      })
    
  } catch (error) {
    console.error('error in get users data  ', error)
  }

    

})


router.get("/users/:id", checkAuthenticated, async (req, res) => {
    const _id=req.params.id

    let usersList =[]

   await Users.find({service_id:_id},async(err,result)=>{

    if(err){
        throw new Error(err)
    }

    if(result.length!==0){
       for(let i=0;i<result.length;i++){
        usersList.push({"user":result[i].username,"role":result[i].role})

       }
       console.log('usersList ', usersList)
        res.status(200).json({users:[...new Set(usersList)]})
     
    }

    // if(usersList.length!==0){
    //     res.status(200).json({users:[...new Set(usersList)]})
    // }

    }).clone()
        .catch(function (err) {
          console.log(err)
        })

 })

// This part mus be fix
 router.post("/users/getid", checkAuthenticated, async (req, res) => {
  const _id=req.body.id_


  
  let usersList =[]

 await Users.find({service_id:_id},async(err,result)=>{

  if(err){
      throw new Error(err)
  }

  if(result.length!==0){
     for(let i=0;i<result.length;i++){
      usersList.push({"user":result[i].username,"role":result[i].role})

     }
     console.log('usersList ', usersList)
      res.status(200).json({users:[...new Set(usersList)]})
   
  }

  // if(usersList.length!==0){
  //     res.status(200).json({users:[...new Set(usersList)]})
  // }

  }).clone()
      .catch(function (err) {
        console.log(err)
      })

})

router.post("/users/list", checkAuthenticated, async (req, res) => {
  const _id=req.body.id

  console.log('req.data ', req.body.id)

  let usersList =[]

  try {

    await Users.find({service_id:_id},async(err,result)=>{

      if(err){
          throw new Error(err)
      }
    
      if(result.length!==0){
         for(let i=0;i<result.length;i++){
          usersList.push({"user":result[i].username,"role":result[i].role})
    
         }
         console.log('usersList ', usersList)
          res.status(200).json({users:[...new Set(usersList)]})
       
      }
    
      // if(usersList.length!==0){
      //     res.status(200).json({users:[...new Set(usersList)]})
      // }
    
      }).clone()
          .catch(function (err) {
            console.log(err)
          })
    
  } catch (error) {
    console.error(' error in user list ', error);
  }



})
    





 

 


module.exports = router;