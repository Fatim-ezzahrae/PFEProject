//require mongoose
const mongoose = require('mongoose');

//create certification schema
const certificationSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    certificatons:[{ 
        title: String,
        description: String
    }]
}, { timestamps: true }
);

certificationSchema.statics.fillCertifications = async function (userId, certifications) {
    if (!Array.isArray(certifications)) {
        throw new Error('Certifications data should be an array');
    }

    // Validate and prepare the certification array
    const certificationEntries = certifications.map(cert => {
        const { title, description } = cert;

        // Validate required fields
        if (!title) {
            throw new Error('Missing required fields in certification');
        }

        return { title, description };
    });

    // Check if a certification document for this user already exists
    let certificationDocument = await this.findOne({ userId });

    if (certificationDocument) {
        // Append new certifications to the existing document
        certificationDocument.certificatons.push(...certificationEntries);
    } else {
        // Create a new document
        certificationDocument = new this({
            userId,
            certificatons: certificationEntries
        });
    }

    // Save the document
    await certificationDocument.save();

    return certificationDocument;
};


//export certification model        
module.exports = mongoose.model('Certification', certificationSchema);