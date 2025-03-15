//require mongoose
const mongoose = require('mongoose');

//create education schema
const educationSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    institute: String,
    degree: String,
    startDate: Date,
    endDate: Date,
    city: String,
    coutnry: String

}, { timestamps: true }
);

//export education model        
module.exports = mongoose.model('Education', educationSchema);