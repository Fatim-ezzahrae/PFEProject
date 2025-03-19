import React, { useState } from 'react';
import ButtonBack from '../../component/ButtonBack';

function JobOfferForm() {
  const [step, setStep] = useState(1);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Job Offer Submitted:', formData);
    setSubmitted(true);
    setShowForm(false); 
  };
  

  return (
    <>
    <div>
    
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className='Jobinfo-wrapper'>
                  <h2>Create a Job Offer</h2>
              <label className="label-Job">Job Title:</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
              
              <label className="label-Job">Company Name:</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required />
              
              <label className="label-Job">Location:</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
              
              <button className="nextJob" type="button" onClick={nextStep}>Next</button>
            </div>
          )}
        
          {step === 2 && (
            <div className='descp-wrapper'>
              <label className="label-Job" >Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
              
              <ButtonBack onClick={prevStep}/>
              <button  className="nextJob" type="button" onClick={nextStep}>Next</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="label-Job">Application Deadline:</label>
              <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} required />
              
              <label className="label-Job" >Contact Information:</label>
              <input type="text" name="contactInfo" value={formData.contactInfo} onChange={handleChange} required />
              
              <ButtonBack onClick={prevStep}/>
              <button  className="nextJob" type="submit">Submit Job Offer</button>
            </div>
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
