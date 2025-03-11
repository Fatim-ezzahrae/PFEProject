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
    pdfFile: { 
        type: Buffer, 
        required: true 
    } // Store PDF as binary data
}, { timestamps: true });

//export templates model        
module.exports = mongoose.model('Template', templateSchema);