//require mongoose
const mongoose = require('mongoose');

//create application schema
const applicationSchema = new mongoose.Schema({

    offerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' }, // Reference to Offer
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    status: String  // "pending", "accepted", "rejected"
    
}, { timestamps: true }
);

//export application model        
module.exports = mongoose.model('Application', applicationSchema);