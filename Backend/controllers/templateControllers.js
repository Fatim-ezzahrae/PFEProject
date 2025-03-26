const pdf = require('pdf-poppler');
const tmp = require('tmp');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const templateModel = require('../models/template');

// Helper function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Upload template
const uploadTemplate = async (req, res) => {
    try {
        const { name, latexCode } = req.body;
        
        if (!name || !latexCode) {
        return res.status(400).json({ message: "Name and LaTeX code are required" });
        }

        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
        }

        // Create temporary file for the uploaded PDF
        const tempPdf = tmp.fileSync({ postfix: '.pdf' });
        fs.writeFileSync(tempPdf.name, req.file.buffer);

        // Set up directories
        const uploadDir = path.join(__dirname, '..', 'uploads', 'images');
        ensureDirectoryExists(uploadDir);

        // Generate unique filename for the image (without extension)
        const imageFilename = `template_${uuidv4()}`;
        const expectedImagePath = path.join(uploadDir, `${imageFilename}.png`);

        // Convert PDF to PNG
        const options = {
        format: 'png',
        out_dir: uploadDir,
        out_prefix: imageFilename, // Use the exact filename we want (without extension)
        page: 1
        };

        await pdf.convert(tempPdf.name, options);

        // The library adds '-1' to the output filename, so we need to rename it
        const actualImagePath = path.join(uploadDir, `${imageFilename}-1.png`);
        if (fs.existsSync(actualImagePath)) {
        // Rename the file to remove the '-1' suffix
        fs.renameSync(actualImagePath, expectedImagePath);
        } else {
        throw new Error('Converted image file not found');
        }

        // Store the template in database
        const newTemplate = new templateModel({
        name,
        latexCode,
        imageFilePath: path.join('uploads', 'images', `${imageFilename}.png`) // Store the correct path
        });

        await newTemplate.save();

        // Clean up temporary file
        tempPdf.removeCallback();

        res.status(201).json({ 
        message: "Template uploaded successfully", 
        template: {
            _id: newTemplate._id,
            name: newTemplate.name,
            imageUrl: `${req.protocol}://${req.get('host')}/${newTemplate.imageFilePath.replace(/\\/g, '/')}`
        }
        });

    } catch (error) {
        console.error("Error uploading template:", error);
        res.status(500).json({ 
        message: "Error uploading template", 
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all templates
const getTemplates = async (req, res) => {
  try {
    const templates = await templateModel.find().select('name _id imageFilePath');

    if (!templates.length) {
      return res.status(404).json({ message: 'No templates found' });
    }
    
    const response = templates.map(template => ({
      _id: template._id,
      name: template.name,
      imageUrl: `${req.protocol}://${req.get('host')}/${template.imageFilePath.replace(/\\/g, '/')}`
    }));

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ 
      message: 'Error fetching templates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get single template (returns JSON with image URL)
const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templateModel.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.status(200).json({
      _id: template._id,
      name: template.name,
      latexCode: template.latexCode,
      imageUrl: `${req.protocol}://${req.get('host')}/${template.imageFilePath.replace(/\\/g, '/')}`
    });

  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ 
      message: 'Error fetching template',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Get template image (returns the actual image file)
const getTemplateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await templateModel.findById(id);
    
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    const filePath = path.join(__dirname, '..', template.imageFilePath);
    console.log("File Path:", filePath);
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Image file not found' });
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `inline; filename=${template.name}.png`);
    res.sendFile(filePath);

  } catch (error) {
    console.error("Error serving template image:", error);
    res.status(500).json({ 
      message: 'Error serving template image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = { 
  uploadTemplate, 
  getTemplates, 
  getTemplate,
  getTemplateImage 
};