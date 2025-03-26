//require mongoose
const mongoose = require('mongoose');

//create resume schema
const resumeSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },   // Reference to User
    latexCode: String
    
} , { timestamps: true }
);

resumeSchema.statics.fillResume = async function (latexCode, userData) {
    // Check if latexCode is valid
    if (!latexCode || typeof latexCode !== 'string') {
        throw new Error("LaTeX template code must be a valid string.");
    }

    const { 
        firstName, 
        lastName, 
        phone, 
        email, 
        address, 
        skills = [], 
        languages = [], 
        experience = [], 
        education = [], 
        certifications = [] 
    } = userData;

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'address'];
    const missingFields = requiredFields.filter(field => !userData[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Escape special LaTeX characters in user data
    const escapeLatex = (str) => {
        if (typeof str !== 'string') return '';
        // First escape special characters
        let escaped = str
            .replace(/\\/g, '\\textbackslash')
            .replace(/&/g, '\\&')
            .replace(/%/g, '\\%')
            .replace(/\$/g, '\\$')
            .replace(/#/g, '\\#')
            .replace(/_/g, '\\_')
            .replace(/{/g, '\\{')
            .replace(/}/g, '\\}')
            .replace(/~/g, '\\textasciitilde')
            .replace(/\^/g, '\\textasciicircum');
        
        // ModernCV specific: protect newlines in certain fields
        if (str.includes('\n')) {
            escaped = escaped.replace(/\n/g, '\\\\');
        }
        return escaped;
    };

    // Helper functions for formatting different sections

    const formatSkills = (skillsArray) => {
        return skillsArray.map(skill => 
            `\\cvitem{${escapeLatex(skill.category || '')}}{${escapeLatex(skill.details || '')}}`
        ).join('\n');
    };

    const formatCertif = (certifsArray) => {
        return certifsArray.map(certif => 
            `\\cvitem{${escapeLatex(certif.title || '')}}{${escapeLatex(certif.description || '')}}`
        ).join('\n');
    };

    const formatLanguages = (languagesArray) => {
        return languagesArray.map(language => 
            `\\cvitem{${escapeLatex(language.language || '')}}{${escapeLatex(language.level || '')}}`
        ).join('\n');
    };

    // ModernCV specific formatting functions
    const formatEducation = (educationArray) => {
        if (educationArray.length === 0) return '% No education provided';
        return educationArray.map(edu => 
            `\\cventry{${escapeLatex(edu.startDateEdu || '')}--${escapeLatex(edu.endDateEdu || '')}}{${escapeLatex(edu.degree || '')}}{${escapeLatex(edu.institute || '')}}{${escapeLatex(edu.city || '')}}{${escapeLatex(edu.country || '')}}{}`
        ).join("\n");
    };

    const formatExperience = (experiencesArray) => {
        if (experiencesArray.length === 0) return '% No experience provided';
        return experiencesArray.map(exp => {
            const descriptionItems = Array.isArray(exp.description) 
                ? exp.description.map(desc => `\\item ${escapeLatex(desc)}`).join('\n')
                : '';
            return `\\cventry{${escapeLatex(exp.startDateEmp || '')}--${escapeLatex(exp.endDateEmp || '')}}{${escapeLatex(exp.jobTitle || '')}}{${escapeLatex(exp.company || '')}}{${escapeLatex(exp.city || '')}}{}{\\begin{itemize}${descriptionItems}\\end{itemize}}`;
        }).join('\n\n');
    };

    // Replace placeholders with escaped user data
    let result = latexCode
        .replace(/{{{first_name}}}/g, `{${firstName}}`)
        .replace(/{{{last_name}}}/g, `{${lastName}}`)
        .replace(/{{{phone}}}/g, `{${phone}}`)
        .replace(/{{{email}}}/g, `{${email}}`)
        .replace(/{{{address}}}/g, `{${address}}`)
        .replace(/{{{education}}}/g, formatEducation(education))
        .replace(/{{{skills}}}/g, formatSkills(skills))
        .replace(/{{{certifications}}}/g, formatCertif(certifications))
        .replace(/{{{languages}}}/g, formatLanguages(languages))
        .replace(/{{{experience}}}/g, formatExperience(experience));

    // Ensure no empty sections remain
    result = result.replace(/\{\{\{\w+\}\}\}/g, '% Missing data');

    return result;

}
//export resume model
module.exports = mongoose.model('Resume', resumeSchema);
