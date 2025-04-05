import Dashboardbut from "../component/Dashbordbutt";
import { useEffect, useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import axios from 'axios';
import '../styles/DashboardPage.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    templates: 0,
    resumes: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const [showOnlyForm, setShowOnlyForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: '',
    latexCode: '',
    pdfFile: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!showOnlyForm) { // Only fetch stats when not showing form
      const fetchStats = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/admin/stats`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });
          setStats(response.data);
          setLoading(false);
          setError(null);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
          setError("Failed to load dashboard statistics. Please try again later.");
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [user.token, showOnlyForm]);

  const handleTemplateSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', templateForm.title);
      formData.append('latexCode', templateForm.latexCode);
      formData.append('pdfFile', templateForm.pdfFile);

      const response = await axios.post(
        'http://localhost:4000/api/templates',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      if (response.data.success) {
        setTemplateForm({
          title: '',
          latexCode: '',
          pdfFile: null
        });
        setShowOnlyForm(false);
        setUploadProgress(0);
        alert('Template added successfully!');
      }
    } catch (error) {
      console.error("Error submitting template:", error);
      setError("Failed to add template. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    setTemplateForm({
      ...templateForm,
      pdfFile: e.target.files[0]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTemplateForm({
      ...templateForm,
      [name]: value
    });
  };

  const toggleFormView = () => {
    setShowOnlyForm(!showOnlyForm);
    setError(null); // Clear any previous errors
  };

  if (showOnlyForm) {
    return (
      <div className="dashboard-container">
        <div className="template-form-container">
          <h2>Add New Template</h2>
          <button 
            className="back-button"
            onClick={toggleFormView}
          >
            ← Back to Dashboard
          </button>
          
          <form onSubmit={handleTemplateSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={templateForm.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="latexCode">LaTeX Code:</label>
              <textarea
                id="latexCode"
                name="latexCode"
                value={templateForm.latexCode}
                onChange={handleInputChange}
                required
                rows="6"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="pdfFile">PDF Template:</label>
              <input
                type="file"
                id="pdfFile"
                name="pdfFile"
                accept=".pdf"
                onChange={handleFileChange}
                required
              />
              {uploadProgress > 0 && (
                <div className="upload-progress">
                  <progress value={uploadProgress} max="100" />
                  <span>{uploadProgress}%</span>
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button type="submit">Submit Template</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard Overview</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="stats-container">
        {loading ? (
          <div className="loading">Loading statistics...</div>
        ) : (
          <>
            <StatCard title="Users" value={stats.users} icon="👥" />
            <StatCard title="Templates" value={stats.templates} icon="📄" />
            <StatCard title="Resumes" value={stats.resumes} icon="📝" />            
          </>
        )}
      </div>
      
      <div className="dashboard-button-container">
        <Dashboardbut onClick={toggleFormView} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
    </div>
  );
};

export default Dashboard;