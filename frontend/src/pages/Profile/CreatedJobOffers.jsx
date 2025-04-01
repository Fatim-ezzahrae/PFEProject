import React, { useState } from "react";
import axios from "axios";
import UpdateJobOffer from "./UpdateJobOffer";
import { format } from "date-fns";

const CreatedJobOffers = ({ jobOffers, setJobOffers, fetchJobOffers }) => {
  const [expandedJob, setExpandedJob] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const [updatedJob, setUpdatedJob] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    description: "",
    applicationDeadline: new Date(),
    contactInfo: "",
  });

  if (!jobOffers) {
    console.error("Job offers not found");
    return null;
  }

  const toggleDescription = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return; // Ensure a job is selected before deleting
    try {
      await axios.delete(`http://localhost:4000/api/jobs/${jobToDelete}`);
      setJobOffers(prevOffers => prevOffers.filter(job => job._id !== jobToDelete));
      await fetchJobOffers();
      setShowConfirm(false);
      setJobToDelete(null); // Reset state after deletion
    } catch (error) {
      console.error("Error deleting job offer:", error);
      fetchJobOffers();
    }
  };
  

  const confirmDelete = (id, event) => {
    event.stopPropagation();
    setJobToDelete(id);
    setShowConfirm(true);
  };
  

  const handleUpdate = (id, event) => {
    event.stopPropagation();
    const jobToEdit = jobOffers.find(job => job._id === id);
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

  const handleUpdateSuccess = () => {
    fetchJobOffers();
    setEditingJobId(null);
  };

  return (
    <div className="job-page-profile">
      {editingJobId ? (
        <UpdateJobOffer
          jobOfferId={editingJobId}
          setJobOffers={setJobOffers}
          updatedJob={updatedJob}
          setUpdatedJob={setUpdatedJob}
          closeForm={() => setEditingJobId(null)}
          fetchJobOffers={fetchJobOffers}
          onUpdateSuccess={handleUpdateSuccess}
        />
      ) : (
        <div className="job-offer-profile">
          <h3 className="job-offers-profile-h2">Created Job Offers</h3>
          {jobOffers.length > 0 ? (
            jobOffers.map((job) => (
              <div key={job._id} className="job-post-profile" onClick={() => toggleDescription(job._id)}>
                <h3 className="job-title-profile">{job.jobTitle}</h3>
                <p>
                  <span className="material-symbols-outlined">apartment</span>
                  <strong className="field">Company:</strong> {job.companyName}
                </p>
                <p>
                  <span className="material-symbols-outlined">location_on</span>
                  <strong className="field">Location:</strong> {job.location}
                </p>
                {expandedJob === job._id && (
                  <p className="job-description">
                    <span class="material-symbols-outlined"> info </span><strong className="field">Job Description:</strong> {job.description}
                  </p>
                )}
                <p>
                <span class="material-symbols-outlined">calendar_month</span><strong className="field">Deadline:</strong>{" "}
                  {format(new Date(job.applicationDeadline), "MMMM dd, yyyy")}
                </p>
                <p>
                <span className="material-symbols-outlined">contacts</span><strong className="field">Contact:</strong> {job.contactInfo}
                </p>

                <div className="job-actions">
                  <button className="delete-jobOffer" onClick={(event) => confirmDelete(job._id, event)}>
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
        )}
       {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <p>Are you sure you want to delete this job offer?</p>      
            <button className="confirm-btn" onClick={handleDelete}>
              <span className="material-symbols-outlined">check_box</span>
            </button>
            <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
              <span className="material-symbols-outlined">cancel</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatedJobOffers;