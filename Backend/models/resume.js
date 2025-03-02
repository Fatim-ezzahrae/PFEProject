//require mongoose
const mongoose = require('mongoose');

//create resume schema
const resumeSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    "latexCode": String
    
} , { timestamps: true }
);

//export resume model
module.exports = mongoose.model('Resume', resumeSchema);