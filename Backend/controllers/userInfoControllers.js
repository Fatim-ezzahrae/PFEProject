const mongoose = require('mongoose'); 

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
  console.log(req.body);

  const { userId, userInfo, employmentHistory, educationHistory, skills, languages, certifications } = req.body;

  try {

    if (!userId) {
      throw new Error('User ID is required');
    }
      // Validate and prepare all the data first (no saving yet)
      const personalData = await personalModel.preparePersonal(userId, userInfo, skills, languages);
      const certifData = await certifModel.prepareCertifications(userId, certifications);
      const experienceData = await experienceModel.prepareExperience(userId, employmentHistory);
      const educationData = await educationModel.prepareEducation(userId, educationHistory);

      // If all data is valid and processed, save everything at once
      const personalDoc = await personalModel.savePersonal(personalData);
      const certifDoc = await certifModel.saveCertifications(certifData);
      const experiencesDoc = await experienceModel.saveExperience(experienceData);
      const educationsDoc = await educationModel.saveEducation(educationData);

      // Respond with success and the saved data
      res.status(201).json({ success: true, personalDoc, certifDoc, experiencesDoc, educationsDoc });

  } catch (error) {
      // Handle any errors during validation or saving
      console.error("Backend error:", error);
      res.status(500).json({ message: error.message || "An error occurred" });
  }
};



module.exports = {hasFilledInfo, fillUserInfo}
