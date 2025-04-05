import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/job.css";

const UpdateJobOffer = ({ 
  jobOfferId, 
  setJobOffers, 
  updatedJob, 
  setUpdatedJob, 
  closeForm,
  fetchJobOffers,
  onUpdateSuccess
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/jobs/${jobOfferId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUpdatedJob(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobOfferId) {
      fetchJobDetails();
    }
  }, [jobOfferId, setUpdatedJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:4000/api/jobs/${jobOfferId}`, updatedJob, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Option 1: Optimistic update
      setJobOffers(prev => prev.map(job => 
        job._id === jobOfferId ? { ...job, ...updatedJob } : job
      ));
      // Option 2: Refresh from server
      await fetchJobOffers();
      onUpdateSuccess();
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Failed to update job offer");
      await fetchJobOffers();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedJob(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="update-job-offer-form">
      <h3>Update Job Offer</h3>      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Job Title:</label>
          <input
            type="text"
            name="jobTitle"
            value={updatedJob.jobTitle || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            name="companyName"
            value={updatedJob.companyName || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={updatedJob.location || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={updatedJob.description || ''}
            onChange={handleChange}
            required
            disabled={loading}
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Application Deadline:</label>
          <input
            type="date"
            name="applicationDeadline"
            value={updatedJob.applicationDeadline ? 
              new Date(updatedJob.applicationDeadline).toISOString().split('T')[0] : ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Contact Information:</label>
          <input
            type="text"
            name="contactInfo"
            value={updatedJob.contactInfo || ''}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Job Offer'}
          </button>
          <button type="button" onClick={closeForm} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateJobOffer;