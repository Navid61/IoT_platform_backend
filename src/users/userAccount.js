const express = require("express");

const router = express.Router();
const passport = require("passport")

const Account = require('../db/models/account')



// // User Filteration
const UserFilter = require("../db/models/filter");
// router.use(nocache)
router.get('/register', async(req,res)=>{
  

  res.status(200).json({msg:'Hello from post method'})

 
  
})




router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
      if (err) {
          return res.status(500).json({
              status: 500,
              message: 'Internal Server Error',
              error: err.message
          });
      }
      if (!user) {
          return res.status(400).json({
              status: 400,
              message: info ? info.message : 'Registration failed',
          });
      }

      req.login(user, { session: false }, (err) => {
          if (err) {
              res.status(400).send(err);
          }

          // Commented out since it's not necessary
          // const newUserFilter = new UserFilter({
          //     username: req.user.username,
          //     role: 'user',
          //     status: true,
          // });
          // await newUserFilter.save()

          res.json({
              status: 200,
              message: 'Register was successful',
              user: user
          });
      });
  })(req, res, next);
});

// router.post(
//   '/register',
//  passport.authenticate('register',(err=>{
// // console.log('err ', err);
// if(err){
//   return err
// }
//  }), { session: false }),
//   async(req, res) => {


// console.log('err ', err)
// // Comment this part, because it seem is not neccessary
// // try{

// //   const newUserFilter = new UserFilter({
// //     username:req.user.username,
// //     role:'user',
// //     status:true,
// //   })

// //  await newUserFilter.save()

// // }catch(e){
// //   console.error('error in registeration form -new filter database')
// // }

  
//       res.json({
//         status:200,
//         message: 'Register was successful',
//         user:req.user
//       })
      
//   })

// router.get('/login',async function(req, res, next){

//   if(req.user){
//     res.status(200).json({
//       login:req.isAuthenticated(),
//       user:req.user.username,
//       role:req.user.role
     
     
//     })
//   }else{
//     res.status(200).json({
//       login:req.isAuthenticated(),
     
//     })

//   }
 
 

// })
 
router.post('/login',async function(req, res, next) {

 

  const username = req.body.username;
  //  console.log('username ', username)
  //  console.log('password in req.body.password',req.body.password)
  passport.authenticate('local', function(err, user, info) {
   
   
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }

  res.json({
    status:200,
    message:'Login was successful',
   
   
   
  })
 
      console.log('req after success login',req.isAuthenticated())
      // return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});

router.post('/logout', function(req, res,next) {

  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy()
    res.json({ 
     
     
      status: "logout",
      msg:"You did logout successfuly"
    });
  });

 
 });


router.get('/logout', function(req, res,next) {
console.log('logout was successful')
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy()
    res.json({ 
     
      status: "logout",
      msg:"You did logout successfuly"
    });
  });

 
 });
 

 


module.exports = router;