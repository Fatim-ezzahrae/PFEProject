//require mongoose
const mongoose = require('mongoose');

//create offer schema
const offerSchema = new mongoose.Schema({
    
    title: String,
    description: String,
    expirationDate: Date,
    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User

}, { timestamps: true }
);  

//export offer model
module.exports = mongoose.model('Offer', offerSchema);