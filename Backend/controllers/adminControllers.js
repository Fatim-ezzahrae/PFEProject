const templateModel = require('../models/template');
const User = require('../models/user');
const Template = require('../models/template');
const Resume = require('../models/resume');

const { v4: uuidv4 } = require('uuid');
const pdf = require('pdf-poppler');
const tmp = require('tmp');
const fs = require('fs');
const path = require('path');

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

const getStats = async (req, res) => {
    try {
        // Count documents in parallel for better performance
        const [usersCount, templatesCount, resumesCount] = await Promise.all([
          User.countDocuments(),
          Template.countDocuments(),
          Resume.countDocuments()
        ]);
    
        res.json({
          users: usersCount,
          templates: templatesCount,
          resumes: resumesCount
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching dashboard statistics' });
      }
}
//export controllers
module.exports = { uploadTemplate, getStats };