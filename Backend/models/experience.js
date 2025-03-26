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
        startDateEmp: String,
        endDateEmp: String
    }]
}, { timestamps: true }
);

experienceSchema.statics.prepareExperience = async function (userId, experienceInfo) {

    if (!Array.isArray(experienceInfo)) {
        throw new Error('Experience data should be an array');
    }
    
    // Validate the data and prepare the experience array
    const experiences = experienceInfo.map((exp, index)  => {
        
        const { company, jobTitle, startDateEmp, endDateEmp, city, description = []} = exp;

         // Check if at least one field is filled
         const hasAnyField = company || jobTitle || city || startDateEmp || endDateEmp || description.length > 0;
         const hasAllFields = company && jobTitle && city && startDateEmp && endDateEmp;
 
         if (hasAnyField && !hasAllFields) {
             throw new Error(`Missing required fields in experience entry #${index + 1}`);
         }

        // Return the experience object
        return {
            company: company || null,
            jobTitle: jobTitle || null,
            startDateEmp: startDateEmp || null,
            endDateEmp: endDateEmp || null,
            city: city || null,
            description: Array.isArray(description) ? description : [],
        };
    });

 
    let experienceDocument = {
        userId,
        experience: experiences
    };

    // Return the experience document
    return experienceDocument;

}

experienceSchema.statics.saveExperience = async function (experienceData) {
    const experienceDoc = new this(experienceData);
    await experienceDoc.save();
    return experienceDoc;  // Return the saved experience document
};

//export experience model        
module.exports = mongoose.model('Experience', experienceSchema);