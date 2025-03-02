//require mongoose
const mongoose = require('mongoose');

//create personal schema
const personalSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    skills: [String],languages: [
    {
      language: String,
      level: String
    }
    ],
    languages: [
      {
        language: String,
        level: String
      }
    ],
    customFields: Map,
    isVisible: Boolean
    
} , { timestamps: true }
);

//export personal model
module.exports = mongoose.model('Personal', personalSchema);