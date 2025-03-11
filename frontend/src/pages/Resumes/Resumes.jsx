import React, { useState } from "react";
import "../../styles/Resumes.css";
import ProgressSteps from "../../component/ProgressSteps";
import "../../styles/ProgressSteps.css";
import Templates from "./Templates";
import Forms from "./Forms";

function Resumes() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", address: "" });
  const [showEmploymentForm, setShowEmploymentForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  
  const [employmentHistory, setEmploymentHistory] = useState([{ jobTitle: "", employer: "", startDate: "", endDate: "", city: "", description: "" }]);
  const [skills, setSkills] = useState([{ skill: "", level: "" }]);
  const [educationHistory, setEducationHistory] = useState([{ school: "", degree: "", startDate: "", endDate: "", city: "", description: "" }]);

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

  return (
    <>
      <ProgressSteps currentStep={currentStep} />
      <div className="resume-container">
        {currentStep === 1 && (
          <Templates 
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            templates={templates}
            handlePrev={handlePrev} 
            handleNext={handleNext} 
            handleUseTemplate={handleUseTemplate}
          />
        )}

        {currentStep === 2 && (
          <Forms 
            userInfo={userInfo} 
            setUserInfo={setUserInfo}
            employmentHistory={employmentHistory} 
            setEmploymentHistory={setEmploymentHistory} 
            skills={skills} 
            setSkills={setSkills} 
            educationHistory={educationHistory}
            setEducationHistory={setEducationHistory}
            showEmploymentForm={showEmploymentForm}
            setShowEmploymentForm={setShowEmploymentForm}
            showSkillsForm={showSkillsForm}
            setShowSkillsForm={setShowSkillsForm}
            showEducationForm={showEducationForm}
            setShowEducationForm={setShowEducationForm}
          />
        )}
      </div>
    </>
  );
}

export default Resumes;
