import React, { useState } from "react";
import AddButton from "../../component/Addbutton.jsx";
import JobOfferForm from "./JobOfferForm.jsx"; 
import "../../styles/Job.css";

function Job() {
  const [showForm, setShowForm] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);  

  };
  

  return (
    <div className="job-page">
      {!showForm && (
        <div className="addbutton">
          <AddButton onClick={handleButtonClick} />
        </div>
      )}
      
      {showForm && <JobOfferForm setShowForm={setShowForm} />}
    </div>
  );
}

export default Job;
