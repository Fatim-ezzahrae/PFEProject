const TemplateModel = require('../models/template');
const PersonalModel = require('../models/personal');
const ExperienceModel = require('../models/experience');
const EducationModel = require('../models/education');
const CertificationModel = require('../models/certifications');
const resumeModel = require('../models/resume');


const latex = require('node-latex');
const { Readable } = require('stream');

const generatePDF = async (req, res) => {
    try {
        const { templateId, userId } = req.params;

        //Fetch the LaTeX template
        const template = await TemplateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Fetch user personal details
        const personalData = await PersonalModel.findOne({ userId });
        if (!personalData) {
            return res.status(404).json({ message: "Personal information not found" });
        }

        // Fetch user's experience details
        const experienceData = await ExperienceModel.findOne({ userId });
        if (!experienceData) {
            return res.status(404).json({ message: "Experience not found" });
        }

        // Fetch user's education details
        const educationData = await EducationModel.findOne({ userId });
        if (!educationData) {
            return res.status(404).json({ message: "Education not found" });
        }

        // Fetch user's certifications
        const certificationData = await CertificationModel.findOne({ userId });
        if (!certificationData) {
            return res.status(404).json({ message: "Certifications not found" });
        }

        // Replace placeholders in the LaTeX code
        const latexCode = template.latexCode;
        const resume = await resumeModel.fillResume(latexCode, {
            ...personalData.toObject(),
            ...experienceData.toObject(),
            ...educationData.toObject(),
            ...certificationData.toObject()
        });        

        // Convert LaTeX to a readable stream for PDF generation
        const input = Readable.from(resume);
        const pdfStream = latex(input);

        // Set headers to serve as a PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="preview.pdf"`);

        // Pipe the generated PDF stream to the response
        pdfStream.pipe(res);

        // Handle any errors during PDF generation
        pdfStream.on('error', (err) => {
            console.error("PDF Generation Error:", err);
            res.status(500).json({ message: "Error generating PDF preview" });
        });

    } catch (error) {

        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { generatePDF };