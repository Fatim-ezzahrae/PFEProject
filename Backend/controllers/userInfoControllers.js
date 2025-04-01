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

       // Save or update using upsert
    const [personalDoc, certifDoc, experiencesDoc, educationsDoc] = await Promise.all([
      personalModel.findOneAndUpdate(
        { userId },
        personalData,
        { upsert: true, new: true }
      ),
      certifModel.findOneAndUpdate(
        { userId },
        certifData,
        { upsert: true, new: true }
      ),
      experienceModel.findOneAndUpdate(
        { userId },
        experienceData,
        { upsert: true, new: true }
      ),
      educationModel.findOneAndUpdate(
        { userId },
        educationData,
        { upsert: true, new: true }
      )
    ]);

      // Respond with success and the saved data
      res.status(200).json({ 
        success: true, 
        personalDoc, 
        certifDoc, 
        experiencesDoc, 
        educationsDoc 
      });

  } catch (error) {
    console.error("Error saving/updating user info:", error);
    res.status(500).json({ 
      message: error.message || "An error occurred" 
    });
  }
};

// get user info
const getUserInfo = async (req, res) => {
  try {
      const userId = req.params.userId;
      
      if (!userId) {
          return res.status(400).json({ error: "User ID is required" });
      }

      // Fetch all data in parallel for better performance
      const [personalData, certifications, education, experience] = await Promise.all([
          personalModel.findOne({ userId }),
          certifModel.find({ userId }),
          educationModel.find({ userId }),
          experienceModel.find({ userId })
      ]);

      if (!personalData) {
          return res.status(404).json({ error: "User not found" });
      }

      // Construct the response object
      const userInfo = {
          personal: personalData,
          certifications,
          education,
          experience
      };

      res.status(200).json(userInfo);
  } catch (error) {
      console.error("Error fetching user information:", error);
      res.status(500).json({ error: "Server error while fetching user information" });
  }
};


module.exports = {hasFilledInfo, fillUserInfo, getUserInfo}
