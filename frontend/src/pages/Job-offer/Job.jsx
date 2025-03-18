import React, { useState } from "react";
import AddButton from "../../component/Addbutton.jsx";
import JobOfferForm from "./JobOfferForm.jsx"; 
import "../../styles/Job.css";

function Job() {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(!showForm);  
  };

  return (
    <div className="job-page">

      <div className="addbutton">
        <AddButton onClick={handleButtonClick} /> {/* Pass the onClick to your button */}
      </div>

      {showForm && <JobOfferForm />} {/* Conditionally render the form based on state */}
    </div>
  );
}

export default Job;
