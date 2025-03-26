//require mongoose
const mongoose = require('mongoose');

const validator = require('validator');

//create personal schema
const personalSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
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
  
  if (!userInfo || typeof userInfo !== 'object') {
    throw new Error('User information is required');
  }

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

  const validatedSkills = skills.map((skill, index) => {
    if (!!skill.category !== !!skill.details) {
      throw new Error(`Missing required fields in skill entry #${index + 1}`);
    }
    return {
      category: skill.category,
      details: skill.details,
    };
  });

  // Validate languages array
  if (!Array.isArray(languages)) {
    throw new Error('Languages should be an array');
  }

  const validatedLanguages = languages.map((lang, index) => {
    if (!!lang.language !== !!lang.level) {
      throw new Error(`Missing required fields in language entry #${index + 1}`);
    }
    return {
      language: lang.language,
      level: lang.level,
    };
  });

 // Process the personal info (but don't save yet)
 const personalData = {
    userId,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    phone: userInfo.phone,
    address: userInfo.address || '',
    skills: validatedSkills,
    languages: validatedLanguages,
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