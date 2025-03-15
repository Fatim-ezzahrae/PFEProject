import React from "react";
import axios from 'axios';

function Templates({ selectedIndex, setSelectedIndex, templates, handlePrev, handleNext, handleUseTemplate }) {

  return (
    <>
      <div>
        <h1 className="title">Choose a Resume Template</h1>
      </div>
      
      <div className="template-wrapper">
        <button className="template-button left" onClick={handlePrev}>&lt;</button>

        {templates.map((template) => (
            <div key={template._id} className="template-card">
                <h3 className="template-title">{template.name}</h3>
                <p className="template-info">{template.userCount} choose this template</p>
                <button className="select-button" onClick={() => handleUseTemplate(template._id)}>Use this template</button>
                <iframe
                    src={template.pdfUrl}
                    className="pdf-iframe"
                    title={template.name}
                ></iframe>
            </div>
        ))}

        <button className="template-button right" onClick={handleNext}>&gt;</button>
      </div>
    </>
  );
}

export default Templates;

