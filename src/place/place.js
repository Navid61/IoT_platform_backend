const express = require("express")

const router = express.Router()

const Account = require("../db/models/account")

const Users = require("../db/models/users")

const Service = require("../db/models/service")

const mongodb = require("../db/config/mongodb")
const usersDB = mongodb.usersDB

const checkAuthenticated = function (req, res, next) {
  
  if (req.isAuthenticated()) {
   
    return next()
  }
}

 router.use(checkAuthenticated)

router.get("/place", checkAuthenticated, async (req, res) => {




  let serviceList = []

  let placeName = []
  let ownerPlaceList = []

 

  await Users.find({ username: req.user.username }, async (err, result) => {
    if (err) {
      throw new Error(err)
    }

    if (result.length !== 0) {
      for (let i = 0; i < result.length; i++) {
        serviceList.push(result[i].service_id)
      }
    }

    for (let j = 0; j <= serviceList.length; j++) {
      await Service.find(
        { service_id: serviceList[j] },
        async (err, result) => {
          if (err) {
            throw new Error(err)
          }

          if (result.length !== 0) {

          
               

             placeName.push({name:result[0].place,service_id:serviceList[j]})
          }
        }
      )
        .clone()
        .catch(function (err) {
          console.error(err)
        })
    }


    await Service.find(
        { owner:req.user.username},
        async (err, result) => {
          if (err) {
            throw new Error(err)
          }

          if (result.length !== 0) {

          
            for(let m=0;m<result.length;m++){
                ownerPlaceList.push({name:result[m].place,service_id:result[m].service_id})

            }
           
    

          

            const entireServices = ownerPlaceList.concat(placeName)
            
                res.status(200).json({
                    status:200,
                    place:entireServices
    
                })

             
          }else{
            res.status(200).json({
                status:200,
                place:placeName

            })
          }

        }
      )
        .clone()
        .catch(function (err) {
          console.error(err)
        })

   
        
 

     
  })
    .clone()
    .catch(function (err) {
      console.error(err)
    })

   
})

router.get("/place/:id", checkAuthenticated, async (req, res) => {
  const service_id = req.params.id

 

  await Users.find(
    { username: req.user.username, service_id: service_id },
    async (err, result) => {
      if (err) {
        throw new Error(err)
      }

      if (result.length !== 0) {
        const rIndex = result.findIndex(
          (item) => item.service_id === service_id
        )

      
        if (rIndex !== -1) {
          res.status(200).json({
            status: 200,
            role: result[rIndex].role,
            place:result[0].place
          })
        }
      } else if (result.length === 0) {
        await Service.find(
          { owner: req.user.username, service_id: service_id },
          async (err, result) => {
            if (err) {
              throw new Error("get customer list and service failed")
            }

            if (result.length !== 0) {
            
              res.status(200).json({
                status: 200,
                role: result[0].role,
                place:result[0].place
              })
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err)
    })
})

router.post("/place/location", checkAuthenticated, async (req, res) => {
  const service_id = req.body.id

 

  await Users.find(
    { username: req.user.username, service_id: service_id },
    async (err, result) => {
      if (err) {
        throw new Error(err)
      }

      if (result.length !== 0) {
        const rIndex = result.findIndex(
          (item) => item.service_id === service_id
        )

      
        if (rIndex !== -1) {
          res.status(200).json({
            status: 200,
            role: result[rIndex].role,
            place:result[0].place
          })
        }
      } else if (result.length === 0) {
        await Service.find(
          { owner: req.user.username, service_id: service_id },
          async (err, result) => {
            if (err) {
              throw new Error("get customer list and service failed")
            }

            if (result.length !== 0) {
            
              res.status(200).json({
                status: 200,
                role: result[0].role,
                place:result[0].place
              })
            }
          }
        )
          .clone()
          .catch(function (err) {
            console.log(err)
          })
      }
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err)
    })
})

module.exports = router
