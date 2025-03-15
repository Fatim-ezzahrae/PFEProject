const TemplateModel = require('../models/template');
const UserModel = require('../models/user');
const latex = require('node-latex');
const { Readable } = require('stream');

const generatePDF = async (req, res) => {
    try {
        const { templateId, userId } = req.params;

        // Fetch the LaTeX template
        const template = await TemplateModel.findById(templateId);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        // Fetch user data
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Replace placeholders in the LaTeX code
        const latexCode = template.latexCode
        const resume = await resumeModel.fillResume(latexCode, user);        

        // Convert LaTeX to a readable stream
        const input = Readable.from(resume);
        const pdfStream = latex(input);

        // Set headers to serve as a PDF response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="document.pdf"`);

        // Pipe the generated PDF stream to the response
        pdfStream.pipe(res);

        // Handle errors
        pdfStream.on('error', (err) => {
            console.error("PDF Generation Error:", err);
            res.status(500).json({ message: "Error generating PDF" });
        });
    } catch (error) {

        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { generatePDF };