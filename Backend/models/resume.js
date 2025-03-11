//require mongoose
const mongoose = require('mongoose');

//create resume schema
const resumeSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    "latexCode": String
    
} , { timestamps: true }
);

resumeSchema.statics.fillResume = async function (latexCode) {
    let latexCode = template.latexCode
    .replace(/{{{first_name}}}/g, user.firstName)
    .replace(/{{{last_name}}}/g, user.lastName)
    .replace(/{{{phone}}}/g, user.phone)
    .replace(/{{{email}}}/g, user.email)
    .replace(/{{{linkedin}}}/g, user.linkedin)
    .replace(/{{{github}}}/g, user.github)
    .replace(/{{{summary}}}/g, user.summary)
    .replace(/{{{education}}}/g, formatEducation(user.education))
    .replace(/{{{skills}}}/g, formatSkills(user.skills))
    .replace(/{{{certifications}}}/g, formatCertif(user.certifications))
    .replace(/{{{languages}}}/g, formatLanguages(user.languages))
    .replace(/{{{experience}}}/g, formatExperience(user.experience));

    // Function to format education dynamically
    function formatEducation(educationArray) {
        return educationArray.map(edu => 
            `\\cventry{${edu.startDate} -- ${edu.endDate}}{${edu.degree}}{${edu.university}}{${edu.city}, ${edu.country}}{}{}`
        ).join("\n\n");
    }

    // Function to format skills dynamically
    function formatSkills(skills) {
        return skills.map(skill => `\\cvitem{${skill.category}}{${skill.details}}`).join('\n');
    }

    // Helper functions to format lists dynamically
    function formatCertif(certifs) {
        return certifs.map(certif => `\\cvitem{${certif.title}}{${certif.description}}`).join('\n');
    }

    // Function to format languages dynamically
    function formatLanguages(languages) {
        return languages.map(language => `\\cvitem{${language.category}}{${language.details}}`).join('\n');
    }

    function formatExperience(experiences) {
        return experiences.map(exp => `
            \\cventry{${exp.years}}{${exp.title}}{${exp.company}}{${exp.location}}{} {
                \\begin{itemize}
                    ${exp.details.map(detail => `\\item ${detail}`).join('\n')}
                \\end{itemize}
            }
        `).join('\n');
    }   
}

//export resume model
module.exports = mongoose.model('Resume', resumeSchema);