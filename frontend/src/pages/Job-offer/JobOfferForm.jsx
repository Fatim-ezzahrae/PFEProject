import React, { useState } from 'react';
import ButtonBack from '../../component/ButtonBack';
import axios from 'axios';
import { useAuthContext } from "../../hooks/useAuthContext";
import '../../styles/Job.css';

function JobOfferForm({ onJobAdded }) {
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    description: '',
    applicationDeadline: '',
    contactInfo: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/jobs', { 
        publisherId: user._id, 
        ...formData 
      });
      console.log('Job Offer Submitted:', response.data);
      setErrorMessage("");
      setSubmitted(true);
      
      // After 2 seconds, call the callback to refresh jobs and close form
      setTimeout(() => {
        onJobAdded();
      }, 700);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error('Error submitting job offer:', error);
    }
  };

  return (
    <div>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className='Jobinfo-wrapper'>
                <h2>Create a Job Offer</h2>
                <label className="label-Job">Job Title:
                  <input type="text" name="jobTitle"  placeholder="Enter job title..." value={formData.jobTitle} onChange={handleChange} required />
                </label>
                
                <label className="label-Job">Company Name:
                  <input type="text" name="companyName" placeholder="Enter company name..." value={formData.companyName} onChange={handleChange} required />
                </label>
                
                <label className="label-Job">Location:
                  <input type="text" name="location"  placeholder="Enter job location..." value={formData.location} onChange={handleChange} required />
                </label>
              </div>
              <button className="nextJob" type="button" onClick={nextStep}>Next</button>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className='descp-wrapper'>
                <label className="label-Job">Description:
                  <textarea name="description" placeholder="Describe the job in detail, including requirements, responsibilities, salary, and any additional information..." value={formData.description} onChange={handleChange} required />
                </label>
              </div>
              <button className="nextJob" type="button" onClick={nextStep}>Next</button>
              <div className="button-back">
                <ButtonBack onClick={prevStep}/>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className='app-wrapper'>
                <label className="label-Job">Application Deadline:
                  <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required />
                </label>
                
                <label className="label-Job">Contact Information:
                  <input type="text" name="contactInfo" placeholder="Enter contact details..." value={formData.contactInfo} onChange={handleChange} required />
                </label>
              </div>
              
              <button className="nextJob" type="submit">Submit Job Offer</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <ButtonBack onClick={prevStep}/>
            </>
          )}
        </form>
      ) : (
        <div className="success-popup">
        <div className="popup-content">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="popup-title">Success</p>
          <p>Job offer has been successfully submitted!</p>
        </div>
      </div>
      )}
    </div>
  );
}

export default JobOfferForm;