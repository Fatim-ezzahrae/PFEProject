//require mongoose
const mongoose = require('mongoose');

//create resume schema
const resumeSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    "latexCode": String
    
} , { timestamps: true }
);

resumeSchema.statics.fillResume = async function (latexCode, userData) {
    // Check if latexCode is valid
    if (!latexCode) {
        throw new Error("LaTeX template code is not defined.");
    }

    // Check if the user object has the required properties
    const { firstName, lastName, phone, email, address, skills, languages, experience, education, certifications} = userData;

    // Ensure user properties are defined
    if (!firstName || !lastName || !phone || !email || !address) {
        throw new Error("User information is incomplete.");
    }
    let resume = latexCode;

    // Replace placeholders in the LaTeX code with actual user data
    resume = resume
        .replace(/{{{first_name}}}/g, firstName ? `{${firstName}}` : "")
        .replace(/{{{last_name}}}/g, lastName ? `{${lastName}}` : "")
        .replace(/{{{phone}}}/g, phone ? `{${phone}}` : "")
        .replace(/{{{email}}}/g, email ? `{${email}}` : "")
        .replace(/{{{address}}}/g, address ? `{${address}}` : "")
        .replace(/{{{education}}}/g, formatEducation(education || []))
        .replace(/{{{skills}}}/g, formatSkills(skills || []))
        .replace(/{{{certifications}}}/g, formatCertif(certifications || []))
        .replace(/{{{languages}}}/g, formatLanguages(languages || []))
        .replace(/{{{experience}}}/g, formatExperience(experience || []));

    // Helper function to format education dynamically
    function formatEducation(educationArray) {
        return educationArray.map(edu => 
            `\\cventry{${edu.startDateEdu} -- ${edu.endDateEdu}}{${edu.degree}}{${edu.institute}}{${edu.city}, ${edu.country}}{}{}`).join("\n\n");
    }

    // Function to format skills dynamically
    function formatSkills(skills) {
        return skills.map(skill => `\\cvitem{${skill.category}}{${skill.details}}`).join('\n');
    }

    // Function to format certifications dynamically
    function formatCertif(certifs) {
        return certifs.map(certif => `\\cvitem{${certif.title}}{${certif.description}}`).join('\n');
    }

    // Function to format languages dynamically
    function formatLanguages(languages) {
        return languages.map(language => `\\cvitem{${language.language}}{${language.level}}`).join('\n');
    }

    // Function to format experience dynamically
    function formatExperience(experiences) {
        return experiences.map(exp => `
            \\cventry{${exp.startDateEmp} -- ${exp.endDateEmp}}{${exp.jobTitle}}{${exp.company}}{${exp.city}}{} {
                \\begin{itemize}
                    ${exp.description.map(desc => `\\item ${desc}`).join('\n')}
                \\end{itemize}
            }
        `).join('\n');
    }

    // Return the final latex code after all replacements
    return resume;
};


//export resume model
module.exports = mongoose.model('Resume', resumeSchema);