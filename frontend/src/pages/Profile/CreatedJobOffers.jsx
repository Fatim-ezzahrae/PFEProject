import React, { useState } from "react";
import axios from "axios";
import UpdateJobOffer from "./UpdateJobOffer";

const CreatedJobOffers = ({ jobOffers, setJobOffers }) => {
  const [expandedJob, setExpandedJob] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [updatedJob, setUpdatedJob] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    description: "",
    applicationDeadline: "",
    contactInfo: "",
  });

  if (!jobOffers) {
    console.error("Job offers not found");
    return null;
  }

  // Toggle job description visibility
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
    // Find the job offer to edit and populate the form fields
    const jobToEdit = jobOffers.find((job) => job._id === id);
    setEditingJobId(jobToEdit._id);
    setUpdatedJob({
      jobTitle: jobToEdit.jobTitle,
      companyName: jobToEdit.companyName,
      location: jobToEdit.location,
      description: jobToEdit.description,
      applicationDeadline: jobToEdit.applicationDeadline,
      contactInfo: jobToEdit.contactInfo,
    });
  };

  const closeForm = () => {
    setEditingJobId(null); // Close the form by resetting the job offer ID
  };

  return (
    <div className="job-page-profile">
      {editingJobId === null ? (
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
              <span className="material-symbols-outlined">info</span> Info - You haven't created any job offers yet.
            </p>
          )}
        </div>
      ) : (
        // Pass necessary props to UpdateJobOffer component
        <UpdateJobOffer
          jobOfferId={editingJobId}
          setJobOffers={setJobOffers}
          updatedJob={updatedJob}
          setUpdatedJob={setUpdatedJob}
          closeForm={closeForm}
        />
      )}
    </div>
  );
};

export default CreatedJobOffers;
