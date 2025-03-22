//require mongoose
const mongoose = require('mongoose');

//create education schema
const educationSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    education: [{
        institute: String,
        degree: String,
        startDateEdu: String,
        endDateEdu: String,
        city: String,
        country: String
    }]
    
}, { timestamps: true }
);

// The function to fill the user's education information
educationSchema.statics.prepareEducation = async function (userId, educationInfo) {
    if (!Array.isArray(educationInfo)) {
        throw new Error('Education data should be an array');
    }

    // Validate and prepare the education array
    const educationEntries = educationInfo.map(edu => {
        const { institute, degree, startDateEdu, endDateEdu, city, country } = edu;

        // Validate required fields (You can add more checks here if necessary)
        if (!institute || !degree || !city || !startDateEdu || !endDateEdu || !country) {
            throw new Error('Missing required fields in education');
        }

        // Return the education object
        return {
            institute,
            degree,
            startDateEdu,
            endDateEdu,
            city,
            country
        };
    });

    let educationDocument = {
        userId,
        education: educationEntries
    };

    // Return the education document
    return educationDocument;
};

educationSchema.statics.saveEducation = async function (educationData) {
    const educationDoc = new this(educationData);
    await educationDoc.save();
    return educationDoc;  // Return the saved education document
};

//export education model        
module.exports = mongoose.model('Education', educationSchema);