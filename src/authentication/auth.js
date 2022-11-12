
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const Account = require("../db/models/account");
const mongodb = require("../db/config/mongodb");
const crypto = require("crypto")
const sigmaBoardDB = mongodb.sigmaBoardDB;
const emailVerification = require("../db/models/verification");

const log =console.log;




// Digital Ocean https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
// ...
module.exports = (passport)=>{

 

passport.use(
    'register',
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
   
      async (username, password, done) => {
        console.log('username in reg form ', username)
        console.log('password in reg form ', password)

      
       await Account.init().then(async()=>{
          try {

         
            const user = await Account.create({ username, password })
            log('user ', user)
              if(user){
                async function encryptMethod(){
                  const { createHmac } = await import('crypto');
                  const secret = 'Yhgd^&%Hbgvd*GBJv#TCHV0poB';
                  const hashmail = createHmac('sha256', secret)
                         .update(`${username}`)
                         .digest('hex');
                         return hashmail
                }
                encryptMethod().then(async(hashmail)=>{
                  console.log('hashmail ', hashmail)
                  console.log('username ', username)
                  const saveEmailHash =  new emailVerification({ 
                    username:username,
                    hashmail:hashmail 
                  });
                  async function createValidation(){
                    await saveEmailHash.save()
                  }
                  createValidation().then(()=>{
                    return done(null, user);
                  })
                   
                })
            
                
              }
          // return done(null, user);
         
           
          } catch (error){
           console.log('error in auth.js ', error)
           
           done(error);
          }

        })
       
               
      })
  
);

// ...

passport.use(
  new LocalStrategy(
       async (username, password, done) => {
         log('loging page username ', username)
        try {
          const user = await Account.findOne({ username });
  
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }
  
          const validate = await user.isValidPassword(password);
  
          if (!validate) {
            return done(null, false, { message: 'Wrong Password' });
          }

          const status = await user.isActive();
          if(!status){
            return done(null, false, { message: 'User account has not been activated' });
          }
  
          return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
          return done(error);
        }
      }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//{_id:id}
passport.deserializeUser(function(id, done) {
  Account.findById(id, function(err, user) {
    done(err, user);
  });
});

}



 

  
  

  
 

