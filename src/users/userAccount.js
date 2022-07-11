const express = require("express");

const router = express.Router();
const passport = require("passport")


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
try{

  const newUserFilter = new UserFilter({
    username:req.user.username,
    role:'user',
    status:true,
  })

 await newUserFilter.save()

}catch(e){
  console.error('error in registeration form -new filter database')
}

  
      res.json({
        status:200,
        message: 'Register was successful',
        user:req.user
      })
      
  }
 
);


 
router.post('/login',async function(req, res, next) {

 

  const username = req.body.username;
  //  console.log('username ', username)
  //  console.log('password in req.body.password',req.body.password)
  passport.authenticate('local', function(err, user, info) {
   
    if (err) { return next(err); }
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

router.get('/logout', function(req, res) {
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