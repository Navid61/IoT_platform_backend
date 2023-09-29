const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const colors = require("colors")

// const sigmaBoardDB = mongodb.sigmaBoardDB

var sigmaBoardDB='mongodb://127.0.0.1:27017/sigmaboard';

try {
  var conn99 = mongoose.createConnection(sigmaBoardDB)
} catch (error) {
  // handleError(error);
  console.error("mongoose error", error)
}

const db99 = conn99

db99.on("error", console.error.bind(console, "connection error: "))
db99.once("open", function () {
  console.log(
    colors.cyan(colors.bold("sigmaBoardDB")) +
      " Connected to MongoDB through mongoose successfully"
  )
})

db99.on('disconnected', function() {
  console.log("Disconnected from DB!" ,'serviceDB');
  // You might decide to try and reconnect here
});

const emailVerificationSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase:true,
    trim:true
  },
  hashmail: {
    type: String,
    required: true,
    trim:true,
  }
});




  


emailVerificationSchema.methods.isValidEmail = async function(hashmail) {
    const user = this;
    // console.log('hash is same ', hashmail)
    if(user.hashmail === hashmail){
      
        return true
        
    }else {
        return false
    }
    
  }

  

const emailVerification = db99.model('emailVerification', emailVerificationSchema);

module.exports= emailVerification;