import React, { useState } from "react";
import "../../styles/Resumes.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExport, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
//import { saveAs } from 'file-saver'; // Cleaner file downloads

const CVPage = ({ generatedResumeURL, selectedTemplateId }) => {
  const { user } = useAuthContext();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [saveStatus, setSaveStatus] = useState({
    loading: false,
    success: false,
    error: null,
    resumeId: null,
    updatedAt: null
  });
  const [exportLoading, setExportLoading] = useState({
    pdf: false,
    latex: false
  });

  const handleSave = async () => {
    console.log("Save initiated"); // Debugging
    try {

      setSaveStatus(prev => ({ ...prev, loading: true }));
  
      const response = await axios.post(
        `http://localhost:4000/api/resume/save-resume`,
        { templateId: selectedTemplateId, userId: user._id }, // Send data in body
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
  
      // Handle successful save
      setSaveStatus({
        loading: false,
        success: true,
        error: null,
        resumeId: response.data.resumeId,
        updatedAt: response.data.updatedAt
      });
  
      // Show success feedback
      toast.success('Resume saved successfully!', {
        position: 'top-right',
        autoClose: 3000
      });
  
    } catch (error) {
      console.error("Save error:", error);

      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to save resume';
      
      setSaveStatus({
        loading: false,
        success: false,
        error: errorMessage
      });
  
      // Show error feedback
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000
      });
    }
  };

  const handleExportPDF = async () => {
    setShowExportOptions(false);
    setExportLoading(prev => ({...prev, pdf: true}));
    if (!saveStatus.resumeId) {
      toast.error("Please save your resume before exporting");
      setExportLoading(prev => ({...prev, pdf: false}));
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:4000/api/resume/export-resume/${saveStatus.resumeId}/pdf?download=true`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `resume_${new Date().toISOString().slice(0,10)}`;
      link.setAttribute('download', `${filename}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
    } catch (error) {
      toast.error(`PDF export failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setExportLoading(prev => ({...prev, pdf: false}));
    }
  };

  const handleExportLaTeX = async () => {
    setShowExportOptions(false);   
    setExportLoading(prev => ({...prev, latex: true})); 
    if (!saveStatus.resumeId) {
      toast.error("Please save your resume before exporting");
      setExportLoading(prev => ({...prev, latex: false}));
      return;
    }
    try {      
      const response = await axios.get(
        `http://localhost:4000/api/resume/export-resume/${saveStatus.resumeId}/latex?download=true`,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
    
      const blob = new Blob([response.data], { type: 'text/x-tex' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `resume_${new Date().toISOString().slice(0,10)}`;
      link.setAttribute('download', `${filename}.tex`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error(`LaTeX export failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setExportLoading(prev => ({...prev, pdf: false}));
    }
  };

  if (!generatedResumeURL) {
    return <div className="cv-container">Loading CV...</div>;
  }

  return (
    <div className="cv-page-container">
      <ToastContainer />
      {/* Action buttons row */}
      <div className="cv-actions">
        <div className="export-dropdown">
          <button 
            className="export-cta" 
            onClick={() => setShowExportOptions(!showExportOptions)}
            disabled={exportLoading.pdf || exportLoading.latex || saveStatus.loading} 
          >
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
    
        <button 
          className="save-button" 
          onClick={handleSave}
          disabled={saveStatus.loading}
        >
          {saveStatus.loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="save-icon" />
              Saving...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faDownload} className="save-icon" />
              Save
            </>
          )}
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