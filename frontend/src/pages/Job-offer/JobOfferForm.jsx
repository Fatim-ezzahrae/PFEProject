import React, { useState } from 'react';
import ButtonBack from '../../component/ButtonBack';
import axios from 'axios';
import { useAuthContext } from "../../hooks/useAuthContext";

function JobOfferForm() {
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
      
      const response = await axios.post('http://localhost:4000/api/jobs', { publisherId: user._id, ...formData });
      console.log('Job Offer Submitted:', response.data);
      setErrorMessage("");
      setSubmitted(true);

    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.error('Error submitting job offer:', error);
    }
  };

  return (
    <>
    <div>
    
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
            <div className='Jobinfo-wrapper'>
                  <h2>Create a Job Offer</h2>
              <label className="label-Job">Job Title:
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required /></label>
              
              <label className="label-Job">Company Name:
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required /></label>
              
              <label className="label-Job">Location:
              <input type="text" name="location" value={formData.location} onChange={handleChange} required /></label>

            </div>
            <button className="nextJob" type="button" onClick={nextStep}>Next</button>
            </>
          )}
        
          {step === 2 && (
            <>
            <div className='descp-wrapper'>
              <label className="label-Job" >Description:
              <textarea name="description" value={formData.description} onChange={handleChange} required /></label>
                            
             </div>
             <button  className="nextJob" type="button" onClick={nextStep}>Next</button>
             <div className="button-back">
             <ButtonBack  onClick={prevStep}/></div>
            </>
          )}

          {step === 3 && (
            <>
            <div className='app-wrapper'>
              <label className="label-Job">Application Deadline:
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required /></label>
              
              <label className="label-Job" >Contact Information:
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required /></label>
              </div>
              
              <button  className="nextJob" type="submit">Submit Job Offer</button>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
             <ButtonBack onClick={prevStep}/>
            </>
          )}
        </form>
      ) : (
        <p>Job offer has been successfully submitted!</p>
      )}
    </div>
    </>
  );
}

export default JobOfferForm;
