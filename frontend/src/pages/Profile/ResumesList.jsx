import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/ResumesList.css"; // We'll create this CSS file

const ResumesList = () => {
  const { user } = useAuthContext();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/resume/users/${user._id}`);
        console.log('API Response:', response); // Add this line
        console.log('Response Data:', response.data); // And this line
        setResumes(response.data.resumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setError(response.data.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchResumes();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Loading your resumes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (resumes.length === 0) {
    return (
      <div className="no-resumes">
        <h3>You haven't created any resumes yet</h3>
        <Link to="/create-resume" className="create-btn">
          Create Your First Resume
        </Link>
      </div>
    );
  }

  return (   
    <div className="resumes-container">
      <div className="resumes-header">
        <h2>Your Resumes</h2>
        <Link to="/create-resume" className="create-btn">
          + New Resume
        </Link>
      </div>

      <div className="resumes-grid">
        {resumes.map((resume) => (
          <div key={resume._id} className="resume-card">
            {resume.imageUrl ? (
              <img 
                src={resume.imageUrl} 
                alt={`Resume ${resume.pdfVersion}`} 
                className="resume-thumbnail"
              />
            ) : (
              <div className="resume-placeholder">
                <span>No Preview Available</span>
              </div>
            )}
            
            {/* <div className="resume-details">
              <p>Created: {new Date(resume.createdAt).toLocaleDateString()}</p>
              <div className="resume-actions">
                <Link 
                  to={`/resume/${resume._id}`} 
                  className="action-btn view-btn"
                >
                  View
                </Link>
                <Link 
                  to={`/resume/${resume._id}/edit`} 
                  className="action-btn edit-btn"
                >
                  Edit
                </Link>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownload(resume._id)}
                >
                  Download
                </button>
              </div> 
            </div>*/}
          </div>
        ))}
      </div>
    </div>
  );

  async function handleDownload(resumeId) {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/resume/download/${resumeId}`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${resumeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download resume');
    }
  }
};

export default ResumesList;