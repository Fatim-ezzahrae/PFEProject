//require mongoose
const mongoose = require('mongoose');

//create statistics schema
const statisticsSchema = new mongoose.Schema({
    
    nbUsers: Number,
    nbCVs: Number,
    nbOffers: Number
    
}, { timestamps: true }
);

//export statistics model        
module.exports = mongoose.model('Statistics', statisticsSchema);