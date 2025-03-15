import React, { useState } from "react";
import "../../styles/Resumes.css";
import ProgressSteps from "../../component/ProgressSteps";
import "../../styles/ProgressSteps.css";
import Templates from "./Templates";
import Forms from "./Forms";
import CVPage from "./Cvpage";

function Resumes() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  
  const [userInfo, setUserInfo] = useState({ firstName:"" ,lastName: "", email: "", phone: "", address: "" });
  const [showEmploymentForm, setShowEmploymentForm] = useState(false);
  const [showLanguagesForm, setShowLanguagesForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [showSkillForm, setShowskillForm] = useState(false);

  const [employmentHistory, setEmploymentHistory] = useState([{ company: "", position: "", startDate: "", endDate: "", city: "", description: "" }]);
  const [languages, setLanguages] = useState([{ language: "", level: "" }]);
  const [educationHistory, setEducationHistory] = useState([{ institute: "", degree: "", startDate: "", endDate: "", city: "", country: "" }]);
  const [certifications, setCertifications] = useState([{ title: "", description: "" }]);
  const [skills, setSkills] = useState([{ category: "", details: "" }]);


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
         languages={languages} 
         setLanguages={setLanguages} 
         educationHistory={educationHistory}
         setEducationHistory={setEducationHistory}
         certifications={certifications}
         setCertifications={setCertifications} 
         skills={skills}
         setSkills={setSkills}
         showEmploymentForm={showEmploymentForm}
         setShowEmploymentForm={setShowEmploymentForm}
         showLanguagesForm={showLanguagesForm}
         setShowLanguagesForm={setShowLanguagesForm}
         showEducationForm={showEducationForm}
         setShowEducationForm={setShowEducationForm}
         showCertificationForm={showCertificationForm}
         setShowCertificationForm={setShowCertificationForm}
         showSkillForm={showSkillForm}
         setShowskillForm={setShowskillForm}
         setCurrentStep={setCurrentStep}  
       />
       
        )}
        {currentStep === 3 && (
          <CVPage 
            userInfo={userInfo} 
            employmentHistory={employmentHistory} 
            languages={languages} 
            educationHistory={educationHistory}
          />
        )}
      </div>
    </>
  );
}

export default Resumes;
