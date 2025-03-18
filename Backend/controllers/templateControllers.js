const templateModel = require('../models/template');


// create/upload template
uploadTemplate = async (req, res) => {
    try {
        const { name, latexCode } = req.body;
        console.log("Name:", name); // Log the name sent in the form

        if (!req.file) {
            console.log("No file uploaded");
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Log the file to check what’s being sent
        console.log("Uploaded file:", req.file);

        const newTemplate = new templateModel({
            name,
            latexCode,
            pdfFile: req.file.buffer // Directly store binary data
        });

        await newTemplate.save();
        res.status(201).json({ message: "Template uploaded successfully", template: newTemplate });
    } catch (error) {
        console.error("Error uploading template:", error); // Log the error
        res.status(500).json({ message: "Error uploading template", error: error.message });
    }
};


//get all templates
const getTemplates = async (req, res) => {
    try {
        const templates = await templateModel.find();

        // Check if templates are empty
        if (!templates || templates.length === 0) {
            return res.status(404).json({ message: 'No templates found' });
        }

        // Respond with template names and PDF URLs
        const response = templates.map(template => ({
            name: template.name,
            _id: template._id,
            pdfUrl: `${req.protocol}://${req.get('host')}/api/templates/${template._id}` // Build a URL for the PDF
        }));

        res.status(200).json(response);

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};


//get single template
const getTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const template = await templateModel.findById(id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename=${template.name}.pdf`);
        res.send(template.pdfFile);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//export controllers
module.exports = { uploadTemplate, getTemplates, getTemplate};