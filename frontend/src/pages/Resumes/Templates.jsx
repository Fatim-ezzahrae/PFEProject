import React from "react";
import axios from 'axios';

function Templates({ selectedIndex, setSelectedIndex, templates, handlePrev, handleNext, handleUseTemplate }) {

  return (
    <>
      <div>
        <h1 className="title">Choose a Resume Template</h1>
      </div>
      
      <div className="template-wrapper">
        <button className="template-button" onClick={handlePrev}><span class="material-symbols-outlined">arrow_back_ios_new</span></button>

        {templates.map((template) => (
            <div key={template._id} className="template-card">
                <h3 className="template-title">{template.name}</h3>
                <button className="select-button" onClick={() => handleUseTemplate(template._id)}>Use this template</button>
                <img
                    src={template.pdfUrl}
                    className="pdf-iframe"
                    alt={template.name}
                ></img>
            </div>
        ))}

        <button className="template-button" onClick={handleNext}><span class="material-symbols-outlined">arrow_forward_ios</span></button>
      </div>
    </>
  );
}

export default Templates;