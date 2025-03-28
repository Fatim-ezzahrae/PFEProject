import React, { useState, useEffect } from "react";
import AddButton from "../../component/Addbutton.jsx";
import JobOfferForm from "./JobOfferForm.jsx"; 
import "../../styles/Job.css";
import axios from 'axios';
import { format } from "date-fns";

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
    fetchJobOffers(); // Refresh the job listings
    setShowForm(false); // Hide the form
  };

  const handleButtonClick = () => {
    setShowForm(true);  
  };

  const toggleDescription = (id) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className="job-page">
      {!showForm ? (
        <>
          <div className="addbutton">
            <AddButton onClick={handleButtonClick} />
          </div>

          <div className="job-offers-container">
            <h2 className="job-offers-container-h2">Recent Job Offers</h2>
            {jobOffers.length === 0 ? (
              <p className="no-job-offers">
                <span className="material-symbols-outlined">info</span> Info - No job offers available.
              </p>
            ) : (
              jobOffers.map((job) => (
                <div key={job._id} className="job-post" onClick={() => toggleDescription(job._id)}>
                  <h3>{job.jobTitle}</h3>
                  <p><span className="material-symbols-outlined">apartment</span><strong className="field">Company:</strong> {job.companyName}</p>
                  <p><span className="material-symbols-outlined">location_on</span><strong className="field">Location:</strong> {job.location}</p>
                  {expandedJob === job._id && (
                    <p className="job-description"><span class="material-symbols-outlined"> info </span><strong className="field">Job Description:</strong> {job.description}</p>
                  )}
                  <p><span class="material-symbols-outlined">calendar_month</span><strong className="field">Deadline:</strong> {format(new Date(job.applicationDeadline), "MMMM dd, yyyy")}</p>
                  <p><span className="material-symbols-outlined">contacts</span><strong className="field">Contact:</strong> {job.contactInfo}</p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="job-offer-form">
        <JobOfferForm onJobAdded={handleNewJobAdded} /></div>
      )}
    </div>
  );
}

export default Job;