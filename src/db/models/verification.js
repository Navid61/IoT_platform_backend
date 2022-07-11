const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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

  

const emailVerification = mongoose.model('emailVerification', emailVerificationSchema);

module.exports= emailVerification;