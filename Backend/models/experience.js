//require mongoose
const mongoose = require('mongoose');

//create experience schema
const experienceSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    company: String,
    position: String,
    descriptions: [String],
    startDate: Date,
    endDate: Date

}, { timestamps: true }
);

//export experience model        
module.exports = mongoose.model('Experience', experienceSchema);