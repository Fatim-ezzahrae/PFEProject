import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Resumes.css";

function Templates({ templates, setCurrentStep, setGeneratedResumeURL, setSelectedTemplateId }) {

  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleUseTemplate = async (templateId) => {

    console.log("Use template clicked:", templateId);
    setSelectedTemplateId(templateId); 

    // 1. Handle auth/data checks
    if (!user) {
      navigate("/sign-up", { state: { fromTemplate: true, templateId } });
      return;
    }

    // 2. Check data and generate resume
    try {
      const userId = user._id;
      
      const checkResponse = await axios.get(`http://localhost:4000/api/info/${userId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log("User info check:", checkResponse.data);

      if (checkResponse.data.hasData) {      
        // User has already entered data → Go directly to resume generation
        const response = await axios.get(`http://localhost:4000/api/resume/generate-resume/${templateId}/${userId}`, {
          responseType: 'blob', // Important for PDF
          headers: {
            Authorization: `Bearer ${user.token}`,
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
    <div className="templates-container">
      <h1 className="title">Choose a Resume Template</h1>
      
      <div className="templates-grid">
        {templates.length > 0 ? (
          templates.map((template) => (
            <div key={template._id} className="template-card">
              <div className="template-preview-container">
                <img
                  src={template.imageUrl}
                  alt="Resume template"
                  className="template-image"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "path-to-fallback-image.jpg";
                  }}
                />
                <button 
                  className="select-button" 
                  onClick={() => {
                    handleUseTemplate(template._id);
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-templates">No templates available</p>
        )}
      </div>
    </div>
  );
}

export default Templates;