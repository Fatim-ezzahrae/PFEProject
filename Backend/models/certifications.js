//require mongoose
const mongoose = require('mongoose');

//create certification schema
const certificationSchema = new mongoose.Schema({
    
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    certifications:[{ 
        title: String,
        description: String
    }]
}, { timestamps: true }
);

certificationSchema.statics.prepareCertifications = async function (userId, certifications) {
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

    // Create a new document
    let certificationDocument = {
        userId,
        certifications: certificationEntries
    };
    

    return certificationDocument;
};


certificationSchema.statics.saveCertifications = async function (certificationData) {
    const certifDoc = new this(certificationData);
    await certifDoc.save();
    return certifDoc;  // Return the saved certification document
};


//export certification model        
module.exports = mongoose.model('Certification', certificationSchema);