const templateModel = require('../models/template');
const User = require('../models/user');
const Template = require('../models/template');
const Resume = require('../models/resume');


const createTemplate = async (req, res) => {
    try {
        const {name, latexCode} = req.body;
        const template = await templateModel.create({ name, latexCode });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
module.exports = { createTemplate, getStats };