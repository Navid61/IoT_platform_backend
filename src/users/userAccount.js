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

router.post(
  '/register',
 passport.authenticate('register', { session: false }),
  async(req, res) => {
    console.log('register ', req.user)
// try{

//   const newUserFilter = new UserFilter({
//     username:req.user.username,
//     role:'user',
//     status:true,
//   })

//  await newUserFilter.save()

// }catch(e){
//   console.error('error in registeration form -new filter database')
// }

  
      res.json({
        status:200,
        message: 'Register was successful',
        user:req.user
      })
      
  }
 
);

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