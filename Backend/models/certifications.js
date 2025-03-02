//require mongoose
const mongoose = require('mongoose');

//create certification schema
const certificationSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    title: String,
    description: String,
    startDate: Date,
    endDate: Date

}, { timestamps: true }
);

//export certification model        
module.exports = mongoose.model('Certification', certificationSchema);