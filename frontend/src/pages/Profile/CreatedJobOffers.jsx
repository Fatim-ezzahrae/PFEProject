import React from "react";
import axios from 'axios';

const CreatedJobOffers = ({ jobOffers }) => {
  if (!jobOffers) {
    console.error("Job offers not found");
    return null;
  }
  
  return (
    <div>
      <h2>Created Job Offers</h2>
      {jobOffers.length > 0 ? (
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
      ) : (
        <p>You haven't created any job offers yet.</p>
      )}
    </div>
  );
};
  
export default CreatedJobOffers;
