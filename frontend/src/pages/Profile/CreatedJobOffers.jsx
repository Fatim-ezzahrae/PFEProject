import React, { useState } from "react";
import axios from "axios";

const CreatedJobOffers = ({ jobOffers, setJobOffers }) => {
  const [expandedJob, setExpandedJob] = useState(null);

  if (!jobOffers) {
    console.error("Job offers not found");
    return null;
  }

  const toggleDescription = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation(); 
    try {
      await axios.delete(`/api/jobOffers/${id}`);
      setJobOffers((prevOffers) => prevOffers.filter((job) => job._id !== id));
      console.log("Job offer deleted successfully");
    } catch (error) {
      console.error("Error deleting job offer:", error);
    }
  };

  const handleUpdate = (id, event) => {
    event.stopPropagation();
    console.log(`Update job offer with ID: ${id}`);
  };

  return (
    <div className="job-page-profile">
      <div className="job-offer-profile">
        <h2 className="job-offers-profile-h2">Created Job Offers</h2>
        {jobOffers.length > 0 ? (
          jobOffers.map((job) => (
            <div key={job._id} className="job-post-profile" onClick={() => toggleDescription(job._id)}>
              <h3 className="job-title-profile">{job.jobTitle}</h3>
              <p>
                <span className="material-symbols-outlined">apartment</span>
                <strong>Company:</strong> {job.companyName}
              </p>
              <p>
                <span className="material-symbols-outlined">location_on</span>
                <strong>Location:</strong> {job.location}
              </p>
              {expandedJob === job._id && (
                <p className="job-description">
                  <strong>Job Description:</strong> {job.description}
                </p>
              )}
              <p>
                <strong>Deadline:</strong> {job.applicationDeadline}
              </p>
              <p>
                <strong>Contact:</strong> {job.contactInfo}
              </p>

              {/* Delete and Update buttons */}
              <div className="job-actions">
                <button className="delete-jobOffer" onClick={(event) => handleDelete(job._id, event)}>
                  <span className="material-symbols-outlined">delete</span>
                </button>
                <button className="update-jobOffer" onClick={(event) => handleUpdate(job._id, event)}>
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-job-offers">
            <span className="material-symbols-outlined">info</span> Info - No job offers available.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatedJobOffers;
