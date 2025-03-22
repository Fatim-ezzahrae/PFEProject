import React, { useState, useEffect } from "react";
import AddButton from "../../component/Addbutton.jsx";
import JobOfferForm from "./JobOfferForm.jsx"; 
import "../../styles/Job.css";
import axios from 'axios';

function Job() {
  const [showForm, setShowForm] = useState(false);
  const [jobOffers, setJobOffers] = useState([]);

  // Fetch job offers from the backend
  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/jobs");
        setJobOffers(response.data);
      } catch (error) {
        console.error("Error fetching job offers:", error);
      }
    };

    fetchJobOffers();
  }, []);

  const handleButtonClick = () => {
    setShowForm(true);  
  };

  return (
    <div className="job-page">
      {!showForm && (
        <>
          <div className="addbutton">
            <AddButton onClick={handleButtonClick} />
          </div>

          {/* Job Offers List - Hidden when showForm is true */}
          <div className="job-offers-container">
            <h2 className="job-offers-container-h2">Recent Job Offers</h2>
            {jobOffers.length === 0 ? (
               <p className="no-job-offers">
               <span className="material-symbols-outlined">info</span> Info - No job offers available.
             </p>
            ) : (
              jobOffers.map((job) => (
                <div key={job._id} className="job-post">
                  <h3>{job.jobTitle}</h3>
                  <p><strong>Company:</strong> {job.companyName}</p>
                  <p><strong>Location:</strong> {job.location}</p>
                  <p>{job.description}</p>
                  <p><strong>Deadline:</strong> {job.applicationDeadline}</p>
                  <p><strong>Contact:</strong> {job.contactInfo}</p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showForm && <JobOfferForm setShowForm={setShowForm} />}
    </div>
  );
}

export default Job;
