import Dashboardbut from "../component/Dashbordbutt";
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (!templateForm.title.trim()) errors.title = 'Title is required';
    if (!templateForm.latexCode.trim()) errors.latexCode = 'LaTeX code is required';
    if (!templateForm.pdfFile) errors.pdfFile = 'PDF file is required';

    // Show toast for each error
    Object.values(errors).forEach(error => {
      toast.error(error);
    });
    
    return Object.keys(errors).length === 0;
  };

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

    if (!validateForm()) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    const toastId = toast.loading('Uploading template...');
    
    try {
      const formData = new FormData();
      formData.append('name', templateForm.title);
      formData.append('latexCode', templateForm.latexCode);
      formData.append('pdfFile', templateForm.pdfFile);

      const response = await axios.post(
        'http://localhost:4000/api/admin/upload',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            // More robust progress calculation
            const progress = progressEvent.total ? 
              Math.round((progressEvent.loaded * 100) / progressEvent.total) :
              Math.round((progressEvent.loaded / (progressEvent.loaded + 100000)) * 100);
            
            setUploadProgress(progress);
            toast.update(toastId, {
              render: `Uploading... ${progress}%`,
              isLoading: true
            });
          }
        }
      );

      // Ensure we show 100% when complete
      setUploadProgress(100);
      toast.update(toastId, {
        render: `Uploading... 100%`,
        isLoading: true
      });

      if (response.data && (response.data.success || response.status === 201)) {
        toast.update(toastId, {
          render: 'Template added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });

        setTemplateForm({
          title: '',
          latexCode: '',
          pdfFile: null
        });

        setUploadProgress(0);

        // Immediately show success and redirect after delay
        setTimeout(() => {
          setShowOnlyForm(false);
        }, 2000);
      }  else {
        throw new Error('Upload completed but server response was not successful');
      }
    } catch (error) {
      console.error("Error submitting template:", error.response?.data || error);

      const errorMessage = error.response?.data?.message || 
                        error.message || 
                        "Failed to add template. Please try again.";

      toast.update(toastId, {
        render: errorMessage,
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsSubmitting(false);
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
    setError(null);
    setFormErrors({});
    setSubmitSuccess(false);
  };

  if (showOnlyForm) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
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
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Uploading...' : 'Submit Template'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
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