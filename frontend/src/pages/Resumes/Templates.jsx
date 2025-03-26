import React from "react";
import "../../styles/templates.css";

function Templates({ selectedIndex, setSelectedIndex, templates, handlePrev, handleNext, handleUseTemplate }) {
  return (
    <>
      <div>
        <h1 className="title">Choose a Resume Template</h1>
      </div>
      
      <div className="template-wrapper">
        <button className="template-button" onClick={handlePrev}>
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
                
        {templates.length > 0 && (
          <div key={templates[selectedIndex]._id} className="template-card">
            <h3 className="template-title">{templates[selectedIndex].name}</h3>
            <button 
              className="select-button" 
              onClick={() => handleUseTemplate(templates[selectedIndex]._id)}
            >
              Use this template
            </button>
            
            {/* Replace iframe with img tag for displaying template preview */}
            <div className="template-preview-container">
              <img
                src={templates[selectedIndex].imageUrl}
                alt={templates[selectedIndex].name}
                className="template-image"
                onError={(e) => {
                  e.target.onerror = null; 
                }}
              />
            </div>
          </div>
        )}
        <button className="template-button" onClick={handleNext}>
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
}

export default Templates;