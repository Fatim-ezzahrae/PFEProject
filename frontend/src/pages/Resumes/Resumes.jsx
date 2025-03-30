import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });
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
  const location = useLocation();

  // Debugging logs
  useEffect(() => {
    console.log("Location state changed:", location.state);
    console.log("User auth status:", user ? "Logged in" : "Not logged in");
  }, [location.state, user]);

  // Handle redirect after authentication
  useEffect(() => {
    const handleAuthRedirect = async () => {
      if (location.state?.fromTemplate && user) {
        const templateId = location.state.templateId;
        console.log("Processing redirect for template:", templateId);
        
        setSelectedTemplateId(templateId);
        
        try {
          const userId = user._id;
          const checkResponse = await axios.get(`http://localhost:4000/api/info/${userId}`);
          
          if (checkResponse.data.hasData) {
            const response = await axios.get(
              `http://localhost:4000/api/resume/generate-resume/${templateId}/${userId}`,
              { responseType: 'blob' }
            );
            
            if (response.status === 200) {
              const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
              const fileUrl = URL.createObjectURL(pdfBlob);
              setGeneratedResumeURL(fileUrl);
              setCurrentStep(3);
              console.log("Resume generated successfully");
            }
          } else {
            setCurrentStep(2);
            console.log("Redirecting to forms step");
          }
        } catch (error) {
          console.error("Error during post-auth processing:", error);
          // Fallback to forms step if there's an error
          setCurrentStep(2);
        }
      }
    };

    handleAuthRedirect();
  }, [location.state, user]);

  // Fetch templates on mount
  useEffect(() => {
    axios.get('http://localhost:4000/api/templates')
      .then((response) => {
        setTemplates(response.data);
      })
      .catch((error) => {
        console.error('Error fetching templates:', error);
      });
  }, []);

  const handlePrev = () => {
    setSelectedIndex((prevIndex) => (prevIndex === 0 ? templates.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex === templates.length - 1 ? 0 : prevIndex + 1));
  };

  const handleUseTemplate = async (templateId) => {
    console.log("Use template clicked:", templateId);
    console.log("Selected Template ID:", selectedTemplateId);

    // 1. Immediately update selected ID
    setSelectedTemplateId(templateId); 

    // 2. Handle auth/data checks
    if (!user) {
      navigate("/sign-up", { state: { fromTemplate: true, templateId } });
      return;
    }

    // 3. Check data and generate resume
    try {
      const userId = user._id;

      // Wait until state is updated before proceeding
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const checkResponse = await axios.get(`http://localhost:4000/api/info/${userId}`);
      console.log("User info check:", checkResponse.data);

      if (checkResponse.data.hasData) {      
        // User has already entered data → Go directly to resume generation
        const response = await axios.get(`http://localhost:4000/api/resume/generate-resume/${selectedTemplateId}/${userId}`, {
          responseType: 'blob', // Important for PDF
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (response.status === 200) {
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob
          setGeneratedResumeURL(fileUrl); // Set the Blob URL to be used in the PDF viewer
          setCurrentStep(3);
          console.log("Resume generated successfully");
        }
      } else {
        // User has not entered data yet
        setCurrentStep(2);
        console.log("No user data found, redirecting to forms");
      }
    } catch (error) {
      console.error("Error during template selection:", error);
      // Fallback to forms step if there's an error
      setCurrentStep(2);
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
            setSelectedTemplateId={setSelectedTemplateId}
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
         selectedTemplateId={selectedTemplateId}
         generatedResumeURL={generatedResumeURL}
         setGeneratedResumeURL={setGeneratedResumeURL}
         handleUseTemplate={handleUseTemplate}
       />
        )}
        
        {currentStep === 3 && (
          <CVPage 
            generatedResumeURL={generatedResumeURL}
            selectedTemplateId={selectedTemplateId}
          />
        )}
      </div>
    </>
  );
}

export default Resumes;