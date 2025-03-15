//require mongoose
const mongoose = require('mongoose');

const validator = require('validator');

//create personal schema
const personalSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: { type: String, default: '' },
    skills: { 
      type: [ { 
        category: String, 
        details: String 
      } ], 
      default: []  // Default to an empty array if not provided
    },
    languages: { 
      type: [ { 
        language: String, 
        level: String 
      } ], 
      default: []  // Default to an empty array if not provided
    },
    customFields: { type: Map, of: String, default: {} },
    
} , { timestamps: true }
);


personalSchema.statics.fillPersonal = async function (userId, userInfo, languages) {
  const [firstName = '', lastName = ''] = userInfo.name ? userInfo.name.split(' ') : [];
  
  if (!validator.isEmail(userInfo.email)) {
    throw Error('Email is not valid');
  }

  // Validate phone number (this will handle various formats)
  if (!validator.isMobilePhone(userInfo.phone, 'any', { strictMode: false })) {
    throw new Error('Phone number is not valid');
  }

  // Create a new personal document using the provided data
  const personalData = new this({
    userId,  // The userId from the parameters
    firstName,
    lastName,
    email: userInfo.email,          
    phone: userInfo.phone,          
    address: userInfo.address,      
    skills: [],                 // skills passed from parameters (array)
    languages: languages, 
  });

  // Save the document to the database
  await personalData.save();

  // Return the saved document or success message
  return personalData;
  
   
}


//export personal model
module.exports = mongoose.model('Personal', personalSchema);