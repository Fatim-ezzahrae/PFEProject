import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Home() {
    const [jobOffers, setJobOffers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobOffers = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/jobs");
            setJobOffers(response.data?.slice(0, 5) || []);
        } catch (error) {
            console.error("Error fetching job offers:", error);
            setError("Failed to load job offers");
        }
    };

    const fetchTemplates = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/templates');
            setTemplates(response.data?.slice(0, 3) || []);
        } catch (error) {
            console.error('Error fetching templates:', error);
            setError("Failed to load templates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
        fetchJobOffers();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
      <div className="home-container">
          {/* Hero Section with new vibrant style */}
          <div className="hero-section">
              <div className="hero-content">
                  <h1 className="home-text">
                      Kickstart Your Career Today
                  </h1>
                  <p className="hero-subtext">
                      Craft stunning resumes that land interviews
                  </p>
                  <Link to="/Resumes" className="home-button pulse">
                      Create your Resume
                  </Link>
              </div>
              <div className='hero-graphic'>
                  <div className="shape-blob"></div>
                  <div className="shape-blob two"></div>
                 
              </div>
          </div>

          {/* Templates Section - Organic Layout */}
          {templates.length > 0 && (
              <div className="templates-section">
                  <h2 className="section-title">
                      <span className="title-deco">✻</span> Templates Gallery <span className="title-deco">✻</span>
                  </h2>
                  <div className="organic-grid">
                      {templates.map((template, index) => (
                          <div 
                              key={template._id} 
                              className={`template-card card-${index % 3}`}
                              style={{ '--rotation': `${-5 + (index * 7)}deg` }}
                          >
                              <img
                                  src={template.imageUrl}
                                  alt="Resume template"
                                  className="template-image"
                              />
                              <Link 
                                  to={`/Resumes?template=${template._id}`}
                                  className="template-button"
                              >
                                  Use This
                              </Link>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* Job Offers - Asymmetrical Layout */}
          {jobOffers.length > 0 && (
              <div className="jobs-section">
                  <h2 className="section-title">
                      <span className="title-deco">✦</span> Fresh Opportunities <span className="title-deco">✦</span>
                  </h2>
                  <div className="jobs-masonry">
                      {jobOffers.map((job, index) => (
                          <div 
                              key={job._id} 
                              className={`job-card card-${index % 4}`}
                          >
                              <div className="job-header">
                                  <h3>{job.jobTitle}</h3>
                                  <span className="company-bubble">{job.companyName}</span>
                              </div>
                              <div className="job-details">
                                  <p><span>📍</span> {job.location}</p>
                                  <p><span>⏳</span> {format(new Date(job.applicationDeadline), "MMM do")}</p>
                              </div>
                              <Link to='/Job' className="job-link">
                                  Explore <span>→</span>
                              </Link>
                              <div className="job-decoration"></div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {/* New CTA Section */}
          <div className="cta-section">
              <div className="cta-card tilt">
                  <h3>Ready to stand out?</h3>
                  <p>Create a resume that gets you noticed in 5 minutes</p>
                  <Link to="/Resumes" className="cta-button">
                      Start Building Now
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default Home;