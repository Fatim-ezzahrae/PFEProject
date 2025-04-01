import React from 'react';
import "../styles/DashboardButt.css";

const DashboardTemplateButton = ({ onClick }) => {
  return (
    <div className="db-template-btn-container">
      <button 
        className="db-template-btn" 
        type="button" 
        onClick={onClick}
      >
        <span className="db-template-btn__icon">
          <svg className="db-svg" fill="none" height={24} stroke="currentColor" 
               strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
               viewBox="0 0 24 24" width={24} xmlns="http://www.w3.org/2000/svg">
            <line x1={12} x2={12} y1={5} y2={19} />
            <line x1={5} x2={19} y1={12} y2={12} />
          </svg>
        </span>
        <span className="db-template-btn__text">Add Template</span>
      </button>
    </div>
  );
};

export default DashboardTemplateButton;