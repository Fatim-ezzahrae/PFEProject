import React from "react";

function Templates({ selectedIndex, setSelectedIndex, templates, handlePrev, handleNext, handleUseTemplate }) {
  return (
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
  );
}

export default Templates;
