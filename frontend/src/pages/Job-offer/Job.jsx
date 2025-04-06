import React, { useState, useEffect } from "react";
import AddButton from "../../component/Addbutton.jsx";
import JobOfferForm from "./JobOfferForm.jsx"; 
import "../../styles/Job.css";
import axios from 'axios';
import { format } from "date-fns";
import { FiInfo } from "react-icons/fi";
import { HiOutlineOfficeBuilding, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineMail } from "react-icons/hi";

function Job() {
  const [showForm, setShowForm] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);

  const fetchJobOffers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/jobs");
      setJobOffers(response.data);
    } catch (error) {
      console.error("Error fetching job offers:", error);
    }
  };

  useEffect(() => {
    fetchJobOffers();
  }, []);

  const handleNewJobAdded = () => {
    fetchJobOffers();
    setShowForm(false);
  };

  const handleButtonClick = () => {
    setShowForm(true);  
  };

  const toggleDescription = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="job-page-profile">
      {!showForm ? (
        <>
          <div className="addbutton">
            <AddButton onClick={handleButtonClick} />
          </div>

          <div className="job-offer-profile">
            <h3 className="job-offers-profile-h2">Recent Job Offers</h3>
            {jobOffers.length === 0 ? (
              <p className="no-job-offers">
                <FiInfo className="icon" /> Info - No job offers available.
              </p>
            ) : (
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
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="job-offer-form">
          <JobOfferForm onJobAdded={handleNewJobAdded} />
        </div>
      )}
    </div>
  );
}

export default Job;