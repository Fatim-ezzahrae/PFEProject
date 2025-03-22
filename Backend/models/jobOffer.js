//require mongoose
const mongoose = require('mongoose');

//create offer schema
const jobOfferSchema = new mongoose.Schema({

    publisherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User
    jobTitle: String,
    companyName: String,
    location: String,
    description: String,
    applicationDeadline: Date,
    contactInfo: String    

}, { timestamps: true }
);  

//export offer model
module.exports = mongoose.model('JobOffer', jobOfferSchema);