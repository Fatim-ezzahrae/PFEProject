import React, { useState } from "react";
import "../../styles/Resumes.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../../hooks/useAuthContext";

const CVPage = ({ userInfo, employmentHistory, languages, educationHistory, generatedResumeURL, setGeneratedResumeURL }) => {
  const { user } = useAuthContext();
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleSave = () => {
    console.log("Saving resume...");
  };

  const handleExportPDF = () => {
    console.log("Exporting as PDF...");
    setShowExportOptions(false);
  };

  const handleExportLaTeX = () => {
    console.log("Exporting as LaTeX code...");
    setShowExportOptions(false);
  };

  if (!generatedResumeURL) {
    return <div className="cv-container">Loading CV...</div>;
  }

  return (
    <div className="cv-page-container">
      {/* Action buttons row */}
      <div className="cv-actions">
        <div className="export-dropdown">
          <button className="export-cta" onClick={() => setShowExportOptions(!showExportOptions)}>
          <FontAwesomeIcon icon={faFileExport} className="export-icon" />
            <span>Export</span>
          </button>
          
          {showExportOptions && (
            <div className="export-options">
              <button onClick={handleExportPDF}>PDF</button>
              <button onClick={handleExportLaTeX}>LaTeX Code</button>
            </div>
          )}
        </div>
    
        <button className="save-button" onClick={handleSave}>
          <FontAwesomeIcon icon={faDownload} className="save-icon" />
          Save
        </button>
      </div>

      <div className="pdf-viewer-container">
        <iframe 
          src={generatedResumeURL} 
          title="Resume Preview"
          className="pdf-iframe"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

export default CVPage;