const templateModel = require('../models/template');

//get all templates
const getTemplates = async (req, res) => {
    try {
        const templates = await templateModel.find();
        //check if templates is empty
        if (templates.length === 0) {
            return res.status(404).json({ message: 'No templates found' });
        }
        res.status(200).json(templates);
    } catch (error) {
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
        res.status(200).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//export controllers
module.exports = { getTemplates, getTemplate};