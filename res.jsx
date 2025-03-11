import React, { useState } from "react";
import "../styles/Resumes.css";
import ProgressSteps from "../component/ProgressSteps";
import "../styles/ProgressSteps.css";

function Resumes() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", address: "" });
  const [showEmploymentForm, setShowEmploymentForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [employmentHistory, setEmploymentHistory] = useState({
    jobTitle: "",
    employer: "",
    startDate: "",
    endDate: "",
    city: "",
    description: "",
  });
  const [skills, setSkills] = useState([{ skill: "", level: "" }]);

  const templates = [
    { name: "Stockholm", userCount: "700K+ users", format: ["PDF", "DOCX"], color: "#ffffff" },
    { name: "Vancouver", userCount: "590K+ users", format: ["PDF"], color: "#f0f0f0" },
    { name: "Dublin", userCount: "5.1M+ users", format: ["PDF", "DOCX"], color: "#004d40", textColor: "#ffffff" },
    { name: "New York", userCount: "4.6M+ users", format: ["PDF", "DOCX"], color: "#ffffff" },
    { name: "Vienna", userCount: "2.6M+ users", format: ["PDF", "DOCX"], color: "#4CAF50", textColor: "#ffffff" },
  ];

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? templates.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex === templates.length - 1 ? 0 : prevIndex + 1));
  };

  const handleUseTemplate = () => {
    setCurrentStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleEmploymentChange = (e) => {
    const { name, value } = e.target;
    setEmploymentHistory((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowEmploymentForm(true);
  };

  const handleEmploymentSubmit = (e) => {
    e.preventDefault();
    setShowSkillsForm(true);
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const newSkills = [...skills];
    newSkills[index][name] = value;
    setSkills(newSkills);
  };

  const addSkill = () => {
    setSkills([...skills, { skill: "", level: "" }]);
  };

  return (
    <>
      <ProgressSteps currentStep={currentStep} />
      <div className="resume-container">
        {currentStep === 1 && (
          <>
          <div>
             <h1 className="title">Choose a Resume Template</h1>
          </div>
              <div className="template-wrapper">
              <button className="template-button left" onClick={handlePrev}>&lt;</button>
              <div className="template-card" style={{ backgroundColor: templates[selectedIndex].color, color: templates[selectedIndex].textColor || "black" }}>
                <h2 className="template-title">{templates[selectedIndex].name}</h2>
                <p className="template-info">{templates[selectedIndex].userCount} chose this template</p>
                <button className="select-button" onClick={handleUseTemplate}>Use this template</button>
              </div>
              <button className="template-button right" onClick={handleNext}>&gt;</button>
            </div>
          </>
        )}

        {currentStep === 2 && !showEmploymentForm && (
          <div className="form-wrapper">
            <h2>Fill in Your Information</h2>
            <form onSubmit={handleFormSubmit}>
              <label>Name:<input type="text" name="name" value={userInfo.name} onChange={handleInputChange} required /></label>
              <label>Email:<input type="email" name="email" value={userInfo.email} onChange={handleInputChange} required /></label>
              <label>Phone:<input type="tel" name="phone" value={userInfo.phone} onChange={handleInputChange} required /></label>
              <label>Address:<input type="text" name="address" value={userInfo.address} onChange={handleInputChange} required /></label>
              <button className="next" type="submit">Next</button>
            </form>
          </div>
        )}

        {currentStep === 2 && showEmploymentForm && !showSkillsForm && (
          <div className="employment-wrapper">
            <h2>Employment History</h2>
            <form onSubmit={handleEmploymentSubmit}>
              <label>Job Title:<input type="text" name="jobTitle" value={employmentHistory.jobTitle} onChange={handleEmploymentChange} required /></label>
              <label>Employer:<input type="text" name="employer" value={employmentHistory.employer} onChange={handleEmploymentChange} required /></label>
              <label>Start Date:<input type="text" name="startDate" value={employmentHistory.startDate} onChange={handleEmploymentChange} required /></label>
              <label>End Date:<input type="text" name="endDate" value={employmentHistory.endDate} onChange={handleEmploymentChange} required /></label>
              <label>City:<input type="text" name="city" value={employmentHistory.city} onChange={handleEmploymentChange} required /></label>
              <label>Description:<textarea name="description" value={employmentHistory.description} onChange={handleEmploymentChange} required /></label>
              <button className="next" type="submit">Next</button>
            </form>
          </div>
        )}

        {currentStep === 2 && showSkillsForm && (
          <div className="skills-wrapper">
            <h2>Skills</h2>
            {skills.map((skill, index) => (
              <div key={index} className="skill-entry">
                <label>Skill:<input type="text" name="skill" value={skill.skill} onChange={(e) => handleSkillChange(index, e)} required /></label>
                <label>Level:
                  <select name="level" value={skill.level} onChange={(e) => handleSkillChange(index, e)} required>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </label>
              </div>
            ))}
            <button type="button" onClick={addSkill}>Add one more skill</button>
          </div>
        )}
      </div>
    </>
  );
}

export default Resumes;
