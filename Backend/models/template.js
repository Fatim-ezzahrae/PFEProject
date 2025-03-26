//require mongoose
const mongoose = require('mongoose');

//create templates schema

const templateSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    latexCode: {
        type: String,
        required: true
    },
    imageFilePath: { 
        type: String, 
        required: true 
    } // Store image url
}, { timestamps: true });


//export templates model        
module.exports = mongoose.model('Template', templateSchema);