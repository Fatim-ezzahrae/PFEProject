const pdf = require('pdf-poppler');
const tmp = require('tmp');
const fs = require('fs');
const path = require('path');

const templateModel = require('../models/template');

// Helper function to ensure directory exists




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
  getTemplates, 
  getTemplate,
  getTemplateImage 
};