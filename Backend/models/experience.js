//require mongoose
const mongoose = require('mongoose');

//create experience schema
const experienceSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    experience: [{
        company: String,
        jobTitle: String,
        description: [String],
        city: String,
        startDate: String,
        endDate: String
    }]
}, { timestamps: true }
);

experienceSchema.statics.fillExperience = async function (userId, experienceInfo) {

    if (!Array.isArray(experienceInfo)) {
        throw new Error('Experience data should be an array');
    }
    
    // Validate the data and prepare the experience array
    const experiences = experienceInfo.map(exp => {
        
        const { company, jobTitle, startDate, endDate, city, description = []} = exp;

        // Validate required fields (You can add more checks here if necessary)
        if (!company || !jobTitle || !city || !startDate || !endDate) {
            throw new Error('Missing required fields in experience');
        }

        // Return the experience object
        return {
            company,
            jobTitle,
            description,
            city,
            startDate: new Date(startDate),
            endDate: endDate && endDate.toLowerCase() !== 'now' ? new Date(endDate) : null
        };
    });

    // Check if an experience document for this user already exists
    let experienceDocument = await this.findOne({ userId });

    if (experienceDocument) {
        // Append new experiences to the existing document
        experienceDocument.experience.push(...experiences);
    } else {
        // Create a new document
        experienceDocument = new this({
            userId,
            experience: experiences
        });
    }

    // Save the document to the database
    await experienceDocument.save();

    // Return the saved experience document
    return experienceDocument;

}

//export experience model        
module.exports = mongoose.model('Experience', experienceSchema);