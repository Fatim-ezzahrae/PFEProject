import React from "react";
import "../../styles/Resumes.css";

function Templates({ setSelectedTemplateId, templates, handleUseTemplate }) {
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
                    setSelectedTemplateId(template._id);
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