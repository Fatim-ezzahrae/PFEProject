//require mongoose
const mongoose = require('mongoose');

//create templates schema
const templateSchema = new mongoose.Schema({
    
    name: String,
    latexCode: String,

}, { timestamps: true }
);

//export templates model        
module.exports = mongoose.model('Template', templateSchema);