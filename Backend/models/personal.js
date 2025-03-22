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

personalSchema.statics.preparePersonal = async function (userId, userInfo, skills, languages) {
  
  if (!validator.isEmail(userInfo.email)) {
    throw Error('Email is not valid');
  }

  // Validate phone number (this will handle various formats)
  if (!validator.isMobilePhone(userInfo.phone, 'any', { strictMode: false })) {
    throw new Error('Phone number is not valid');
  }

  // validate skills
  if (!Array.isArray(skills)) {
    throw new Error('Skills should be an array');
  }

  // validate languages
  if (!Array.isArray(languages)) {
    throw new Error('Languages should be an array');
  }

 // Process the personal info (but don't save yet)
 const personalData = {
    userId,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    phone: userInfo.phone,
    address: userInfo.address,
    skills,
    languages,
  };
  
  // Return the saved document or success message
  return personalData;   
}

personalSchema.statics.savePersonal = async function (personalData) {
  const personalDoc = new this(personalData);
  await personalDoc.save();
  return personalDoc;  // Return the saved document
};


//export personal model
module.exports = mongoose.model('Personal', personalSchema);