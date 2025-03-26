import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Resumes.css";
import ProgressSteps from "../../component/ProgressSteps";
import "../../styles/ProgressSteps.css";
import Templates from "./Templates";
import Forms from "./Forms";
import CVPage from "./Cvpage";
import { useAuthContext } from "../../hooks/useAuthContext";

function Resumes() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null); 

  const [generatedResumeURL, setGeneratedResumeURL] = useState(null);
  
  const [userInfo, setUserInfo] = useState({ firstName:"" ,lastName: "", email: "", phone: "", address: "" });
  const [showEmploymentForm, setShowEmploymentForm] = useState(false);
  const [showLanguagesForm, setShowLanguagesForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [showSkillForm, setShowskillForm] = useState(false);

  const [employmentHistory, setEmploymentHistory] = useState([{ company: "", jobTitle: "", startDateEmp: "", endDateEmp: "", city: "", description: [] }]);
  const [languages, setLanguages] = useState([{ language: "", level: "" }]);
  const [educationHistory, setEducationHistory] = useState([{ institute: "", degree: "", startDateEdu: "", endDateEdu: "", city: "", country: "" }]);
  const [certifications, setCertifications] = useState([{ title: "", description: "" }]);
  const [skills, setSkills] = useState([{ category: "", details: "" }]);


  const [templates, setTemplates] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();


  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? templates.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex === templates.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    // Fetch all templates using Axios
    axios.get('http://localhost:4000/api/templates')
        .then((response) => {
            setTemplates(response.data);
        })
        .catch((error) => {
            console.error('Error fetching templates:', error);
        });
  }, []);

  const handleUseTemplate = async (templateId) => {
    
    //const selectedTemplate = templates[selectedIndex]; // Ensure we use the selectedIndex
    setSelectedTemplateId(templateId);
        
    // Sending the selected template ID to the backend using Axios
    try {

      if (!user) {
        console.log("Invalid user data, redirecting to signup...");
        navigate("/sign-up");
        return;
      }

      const userId = user._id;

      // Wait until state is updated before proceeding
      await new Promise(resolve => setTimeout(resolve, 0));

      // Step 1: Check if the user has already entered their data
      const checkResponse = await axios.get(`http://localhost:4000/api/info/${userId}`);

      if (checkResponse.data.hasData) {
      
        // User has already entered data → Go directly to resume generation
        const response = await axios.get(`http://localhost:4000/api/resume/generate-resume/${templateId}/${userId}`, {
          responseType: 'blob', // Important for PDF
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (response.status === 200) {
          // Create a Blob from the binary data
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob
          setGeneratedResumeURL(fileUrl); // Set the Blob URL to be used in the PDF viewer
          console.log("url", generatedResumeURL);
          setCurrentStep(3);
          console.log("Resume generated successfully:", response.data);
        } else {
          console.error("Error generating resume:", response.data);
        }
      } else {
       
        setCurrentStep(2);
      }

    } catch (error) {
      console.error("Error during template selection:", error);
    }
    
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
         templateId={selectedTemplateId}
         generatedResumeURL={generatedResumeURL}
         setGeneratedResumeURL={setGeneratedResumeURL}
         handleUseTemplate={handleUseTemplate}
       />
       
        )}
        {currentStep === 3 && (
          <CVPage 
            userInfo={userInfo} 
            employmentHistory={employmentHistory} 
            languages={languages} 
            educationHistory={educationHistory}
            generatedResumeURL={generatedResumeURL}
            setGeneratedResumeURL={setGeneratedResumeURL}
          />
        )}
      </div>
    </>
  );
}

export default Resumes;
