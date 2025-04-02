import React, { useState } from "react";
import axios from "axios";
import { FaRegTrashAlt, FaRegEdit, FaCheck, FaTimes } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineMail } from "react-icons/hi";
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
                <div className="job-details-row">
                  <HiOutlineOfficeBuilding className="inline-icon" />
                  <strong className="field">Company:</strong> {job.companyName}
                </div>
                <div className="job-details-row">
                  <HiOutlineLocationMarker className="inline-icon" />
                  <strong className="field">Location:</strong> {job.location}
                </div>
                {expandedJob === job._id && (
                  <div className="job-description-container">
                    <div className="description-header">
                      <FiInfo className="inline-icon" />
                      <strong className="field">Job Description:</strong>
                    </div>
                    <div className="description-content">
                      {job.description}
                    </div>
                </div>
                )}
                <div className="job-details-row">
                  <HiOutlineCalendar className="inline-icon" />
                  <strong className="field">Deadline:</strong>{" "}
                  {format(new Date(job.applicationDeadline), "MMMM dd, yyyy")}
                </div>
                <div className="job-details-row">
                  <HiOutlineMail className="inline-icon" />
                  <strong className="field">Contact:</strong> {job.contactInfo}
                </div>

                <div className="job-actions">
                  {/* Enhanced Delete Button */}
                  <button 
                    className="action-btn delete-btn"
                    onClick={(event) => confirmDelete(job._id, event)}
                    aria-label="Delete job offer"
                  >
                    <FaRegTrashAlt className="action-icon" />
                    <span className="tooltip">Delete</span>
                  </button>

                  {/* Enhanced Update Button */}
                  <button 
                    className="action-btn edit-btn"
                    onClick={(event) => handleUpdate(job._id, event)}
                    aria-label="Edit job offer"
                  >
                    <FaRegEdit className="action-icon" />
                    <span className="tooltip">Edit</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-job-offers">
              <FiInfo className="icon" /> Info - You haven't created any job offers yet.
            </p>
          )}
        </div>
        )}
       {showConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <p>Are you sure you want to delete this job offer?</p>      
            <button className="confirm-btn" onClick={handleDelete}>
              <FaCheck className="confirm-icon" />
            </button>
            <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
              <FaTimes className="cancel-icon" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CreatedJobOffers;