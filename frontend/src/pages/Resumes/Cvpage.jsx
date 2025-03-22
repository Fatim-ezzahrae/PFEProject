import React, { useState } from "react";
import "../../styles/CVPage.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const CVPage = ({ userInfo, employmentHistory, languages, educationHistory, generatedResumeURL, setGeneratedResumeURL }) => {
  const { user } = useAuthContext();

  if (!generatedResumeURL) {
    return <div className="cv-container">Loading CV...</div>;
  }

  return (
    <div className="pdf-viewer-container">
      {generatedResumeURL && (
        <iframe
          src={generatedResumeURL}
          className="pdf-iframe"
          title="Resume Preview"
        />
      )}
    </div>
  );
};

export default CVPage;
