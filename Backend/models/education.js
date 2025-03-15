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
    country: String
}, { timestamps: true }
);

// The function to fill the user's education information
educationSchema.statics.fillEducation = async function (userId, educationInfo) {
    if (!Array.isArray(educationInfo)) {
        throw new Error('Education data should be an array');
    }

    // Validate and prepare the education array
    const educationEntries = educationInfo.map(edu => {
        const { institute, degree, startDate, endDate, city, description } = edu;

        // Validate required fields (You can add more checks here if necessary)
        if (!institute || !degree || !city || !startDate || !endDate) {
            throw new Error('Missing required fields in education');
        }

        // Return the education object
        return {
            institute,
            degree,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            city,
            description
        };
    });

    // Create a new education document and associate it with the user
    const educationDocument = new this({
        userId,
        education: educationEntries
    });

    // Save the document to the database
    await educationDocument.save();

    // Return the saved education document
    return educationDocument;
};
//export education model        
module.exports = mongoose.model('Education', educationSchema);