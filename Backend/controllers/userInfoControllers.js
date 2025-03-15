const personalModel = require('../models/personal');
const certifModel = require('../models/certifications');
const educationModel = require('../models/education');
const experienceModel = require('../models/experience');



const hasFilledInfo = async (req, res) => {
    try {
        const userData = await personalModel.findOne({ userId: req.params.userId });
    
        if (userData) {
          res.json({ hasData: true });  // User has data
        } else {
          res.json({ hasData: false }); // No data found
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Server error" });
      }
}

const fillUserInfo = async (req, res) => {

    const { userId, userInfo, employmentHistory, educationHistory, languages } = req.body;

    try {
        const personal = await personalModel.fillPersonal(userId, userInfo, languages);
        //const certifications = await certifModel.create(certifications);
        const experiences = await experienceModel.fillExperience(userId, employmentHistory); 
        const educations = await educationModel.fillEducation(userId, educationHistory);
        
        res.status(201).json({personal, educations, experiences});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {hasFilledInfo, fillUserInfo}