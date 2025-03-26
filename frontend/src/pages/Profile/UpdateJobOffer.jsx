import React, { useEffect } from "react";
import axios from "axios";
import "../../styles/job.css";

const UpdateJobOffer = ({ jobOfferId, setJobOffers, updatedJob, setUpdatedJob, closeForm }) => {
  const [loading, setLoading] = React.useState(true);

  // Fetch the job offer details when the form is opened
  useEffect(() => {
    if (jobOfferId) {
      setLoading(true); // Start loading when fetching data
      axios
        .get(`/api/jobs/${jobOfferId}`)
        .then((response) => {
          setUpdatedJob(response.data); // Populate the form with existing data
          setLoading(false); // Stop loading after data is set
        })
        .catch((error) => {
          console.error("Error fetching job offer details:", error);
          setLoading(false); // Stop loading even if there's an error
        });
    }
  }, [jobOfferId, setUpdatedJob]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:4000/api/jobs/${jobOfferId}`, updatedJob);
      setJobOffers((prevOffers) =>
        prevOffers.map((job) =>
          job._id === jobOfferId ? { ...job, ...response.data } : job
        )
      );
      closeForm(); // Close the form after submission
    } catch (error) {
      console.error("Error updating job offer:", error);
    }
  };

  const handleChange = (e) => {
    setUpdatedJob({ ...updatedJob, [e.target.name]: e.target.value });
  };

  // Conditionally render loading state or the form
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-job-offer-form">
      <h3>Update Job Offer</h3>
      <form onSubmit={handleFormSubmit}>
        <label>Job Title</label>
        <input
          type="text"
          name="jobTitle"
          value={updatedJob.jobTitle}
          onChange={handleChange}
          required
        />

        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={updatedJob.companyName}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={updatedJob.location}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={updatedJob.description}
          onChange={handleChange}
          required
        />

        <label>Application Deadline</label>
        <input
          type="date"
          name="applicationDeadline"
          value={updatedJob.applicationDeadline}
          onChange={handleChange}
          required
        />

        <label>Contact Information</label>
        <input
          type="text"
          name="contactInfo"
          value={updatedJob.contactInfo}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Job Offer</button>
        <button type="button" onClick={closeForm}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UpdateJobOffer;
