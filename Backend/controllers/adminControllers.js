const templateModel = require('../models/template');

const createTemplate = async (req, res) => {
    try {
        const {name, latexCode} = req.body;
        const template = await templateModel.create({ name, latexCode });
        res.status(201).json(template);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//export controllers
module.exports = { createTemplate };