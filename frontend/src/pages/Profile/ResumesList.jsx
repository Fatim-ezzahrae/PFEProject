import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/ResumesList.css"; 

const ResumesList = () => {
  const { user } = useAuthContext();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  // Fetch resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/resume/users/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setResumes(response.data.resumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        setError(error.response?.data?.message || "Failed to load resumes");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchResumes();
    }
  }, [user]);

  async function handleDownload(resumeId) {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/resume/download/${resumeId}`,
        { 
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${user.token}`,
          }
        }
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
        <Link to="/Resumes" className="create-btn">
          Create Your First Resume
        </Link>
      </div>
    );
  }

  return (   
    <div className="resumes-container">
      <div className="resumes-header">
        <h2>Your Resumes</h2>
        <>
        <Link to="/Resumes" className="create-btn">
          + New Resume
        </Link></>
      </div>

      <div className="resumes-grid">
        {resumes.map((resume) => (
          <div 
            key={resume._id} 
            className="resume-card"
            onClick={() => setSelectedResume(resume)}
          >
            {resume.imageUrl ? (
              <img 
                src={resume.imageUrl} 
                alt={`Resume ${resume._id}`} 
                className="resume-thumbnail"
              />
            ) : (
              <div className="resume-placeholder">
                <span>No Preview Available</span>
              </div>
            )}
            
          </div>
        ))}
      </div>

      {/* Modal overlay for expanded view */}
      <div className={`modal-overlay ${selectedResume ? 'active' : ''}`}>
        {selectedResume && (
          <div className="expanded-resume">
            <button 
              className="close-modal"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedResume(null);
              }}
            >
              &times;
            </button>
            {selectedResume.imageUrl ? (
              <img 
                src={selectedResume.imageUrl} 
                alt={`Resume ${selectedResume._id}`}
              />
            ) : (
              <div className="resume-placeholder">
                <span>No Preview Available</span>
              </div>
            )}
           
          </div>
        )}
      </div>
       <>
        <Link to="/Resumes" className="create-btn">
          + New Resume
        </Link></>
    </div>
  );
};

export default ResumesList;