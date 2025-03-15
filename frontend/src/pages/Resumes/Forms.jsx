import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useAuthContext } from "../../hooks/useAuthContext";

const Forms = ({
  userInfo, setUserInfo, 
  employmentHistory, setEmploymentHistory, 
  languages, setLanguages, 
  educationHistory, setEducationHistory,
  certifications, setCertifications,
  showEmploymentForm, setShowEmploymentForm,
  showLanguagesForm, setShowLanguagesForm,
  showEducationForm, setShowEducationForm,
  showCertificationForm, setShowCertificationForm, setSkills, showSkillForm, skills, setShowskillForm 
}) =>{

  const { user } = useAuthContext();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleEmploymentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEmploymentHistory = [...employmentHistory];
    updatedEmploymentHistory[index][name] = value;
    setEmploymentHistory(updatedEmploymentHistory);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedEducationHistory = [...educationHistory];
    updatedEducationHistory[index][name] = value;
    setEducationHistory(updatedEducationHistory);
  };

  const handleLanguageChange = (index, e) => {
    const { name, value } = e.target;
    const newLanguages = [...languages];
    newLanguages[index][name] = value;
    setLanguages(newLanguages);
  };


  const handleDateChange = (index, name, date) => {
    const updatedEmploymentHistory = [...employmentHistory];
    updatedEmploymentHistory[index][name] = date; 
    setEmploymentHistory(updatedEmploymentHistory);
  };
  
  const handleEducationDateChange = (index, name, date) => {
    const updatedEducationHistory = [...educationHistory];
    updatedEducationHistory[index][name] = date; 
    setEducationHistory(updatedEducationHistory);
  };
  
  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCertifications = [...certifications];
    updatedCertifications[index][name] = value;
    setCertifications(updatedCertifications);
  };


  const handleskillChange = (index, e) => {
    const { name, value } = e.target;
    const updatedskill = [...skills];
    updatedskill[index][name] = value;
    setSkills(updatedskill);
  };
  

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const sortedCountries = response.data.sort((a, b) => {
          return a.name.common.localeCompare(b.name.common);
        });
        setCountries(sortedCountries);
      })
      .catch((error) => {
        console.error("Error fetching country data", error);
      });
  }, []);
  


  const addEmployment = () => {
    setEmploymentHistory([
      ...employmentHistory,
      {
        company: "",
        position: "",
        startDate:null,
        endDate: null,
        city: "",
        description: "",
      },
    ]);
  };

  const addEducation = () => {
    setEducationHistory([
      ...educationHistory,
      {
        institute: "",
        degree: "",
        startDate: null,
        endDate: null,
        city: "",
        country: "",
      },
    ]);
  };

  const addLanguage = () => {
    setLanguages([...languages, { language: "", level: "" }]); 
  };

  const addCertification = () => {
    setCertifications([...certifications, { title: "", description: "" }]);
  };

  const addskill = () => {
    setSkills([...skills, { category: "", details: "" }]);
  };

  
  const handleSubmit = async () => {
    try {
      console.log({
        userId: user._id,
        userInfo,
        employmentHistory,
        educationHistory,
        skills,
      }); 
      const response = await axios.post("http://localhost:4000/api/info", {
        userId: user._id,
        userInfo,
        employmentHistory,
        educationHistory,
        skills,
      });
  
      if (response.data.success) {
        alert("CV submitted successfully!");
      } else {
        alert("There was an error submitting your CV.");
      }
    } catch (error) {
      console.error("Error submitting CV:", error);
      alert("An error occurred while submitting your CV.");
    }
  };

  return (
    <>
      {/* User Information Form */}
      {!showEmploymentForm && !showEducationForm && !showLanguagesForm && !showCertificationForm && !showSkillForm && ( 
        <>
        <div className="form-wrapper">
          <h2>Fill in Your Information</h2>          
            <form onSubmit={(e) => e.preventDefault()}>
            <div className="row">
            <label className="label-form">First Name:<input type="text" name="firstName" value={userInfo.firstName} onChange={handleInputChange} required /></label>
            <label className="label-form">Last Name:<input type="text" name="lastName" value={userInfo.lastName} onChange={handleInputChange} required /></label>
            </div>
            <label className="label-form">Email:<input type="email" name="email" value={userInfo.email} onChange={handleInputChange} required /></label>
            <label className="label-form">Phone:<input type="tel" name="phone" value={userInfo.phone} onChange={handleInputChange} required /></label>
            <label className="label-form">Address:<input type="text" name="address" value={userInfo.address} onChange={handleInputChange} required /></label>
            </form>
            
        </div>
         <button className="next" type="submit" onClick={() => setShowEmploymentForm(true)}>Next</button>
         </>
      )}

     {/* Employment Form */}
     {showEmploymentForm && !showEducationForm && !showLanguagesForm && !showCertificationForm && !showSkillForm && (
    <>
    <div className="employment-wrapper">
      <h2>Employment History</h2>
      {employmentHistory.map((employment, index) => (
        <div key={index} className="employment-entry">
          <div className="row">
            <label className="label-form">Company:
              <input type="text" name="company" value={employment.company} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
            <label className="label-form">Position:
              <input type="text" name="position" value={employment.position} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
          </div>
          <div className="row">
            <label className="label-form">Start Date:
              <div className="date-picker-wrapper">
                <DatePicker 
                  selected={employment.startDate} 
                  onChange={(date) => handleDateChange(index, "startDate", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText=" Select a date"
                />
                <span className="calendar-icon" onClick={() => document.querySelector(`#startDate-${index}`).focus()}>
                  <span className="material-symbols-outlined">calendar_month</span>
                </span>
              </div>
            </label>
            <label className="label-form">End Date:
              <div className="date-picker-wrapper">
                <DatePicker 
                  selected={employment.endDate} 
                  onChange={(date) => handleDateChange(index, "endDate", date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText=" Select a date"
                />
                <span className="calendar-icon" onClick={() => document.querySelector(`#endDate-${index}`).focus()}>
                  <span className="material-symbols-outlined">calendar_month</span>
                </span>
              </div>
            </label>
            <label className="label-form city-wrapper">City:
              <input type="text" name="city" value={employment.city} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
          </div>
          <label className="label-form">Description:
            <textarea name="description" value={employment.description} onChange={(e) => handleEmploymentChange(index, e)} required />
          </label>
        </div>
      ))}          
    </div>
    <button  className="add-button" type="button" onClick={addEmployment}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more employment</button>
    <button className="next" type="button" onClick={() => setShowEducationForm(true)}>Next</button>
             
      </>
      )}


    {/* Education from */}
    {showEducationForm && !showLanguagesForm && !showCertificationForm && !showSkillForm && (
      <>

    <div className="education-wrapper">
    <h2>Education History</h2>
    {educationHistory.map((education, index) => (
      <div key={index} className="education-entry">
        <div className="row">
          <label className="label-form">Institute:
            <input type="text" name="institute" value={education.institute} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
          <label className="label-form">Degree:
            <input type="text" name="degree" value={education.degree} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
        </div>
        <div className="row">
          <label className="label-form">Start Date:
            <div className="date-picker-wrapper1">
              <DatePicker 
                selected={education.startDate} 
                onChange={(date) => handleEducationDateChange(index, "startDate", date)}
                dateFormat="yyyy-MM-dd"
                  placeholderText=" Select a date"
                customInput={<input type="text" />}
              />
              <span className="calendar-icon1" onClick={() => document.querySelector(`#eduStartDate-${index}`).focus()}>
                <span className="material-symbols-outlined">calendar_month</span>
              </span>
            </div>
          </label>
          <label className="label-form">End Date:
            <div className="date-picker-wrapper1">
              <DatePicker 
                selected={education.endDate} 
                onChange={(date) => handleEducationDateChange(index, "endDate", date)}
                dateFormat="yyyy-MM-dd"
                placeholderText=" Select a date"
                customInput={<input type="text" />}
              />
              <span className="calendar-icon1" onClick={() => document.querySelector(`#eduEndDate-${index}`).focus()}>
                <span className="material-symbols-outlined">calendar_month</span>
              </span>
            </div>
          </label>
          </div>
          <div className="row">
          <label className="label-form ">City:
            <input type="text" name="city" value={education.city} onChange={(e) => handleEducationChange(index, e)} required />
          </label>        
           <label className="label-form">Country:
                  <select 
                    name="country"
                    value={education.country}
                    onChange={(e) => handleEducationChange(index, e)}
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.cca2} value={country.name.common}>
                        {country.name.common}
                      </option>
                    ))}
                  </select>
        </label>
        </div>
      </div>
           ))}
           </div> 
         <button className="add-button" type="button" onClick={addEducation}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more education</button>
         <button className="next" type="button" onClick={() => setShowLanguagesForm(true)}>Next</button>
        </>
      )}


      {/* Language Form */}
      {showLanguagesForm && !showCertificationForm && !showSkillForm && (
      <>
        <div className="Language-wrapper">
      <h2>Languages</h2>
      
      {languages.map((language, index) => (
        <div key={index} >
          <div className="row">
          <label className="label-form-Language">Language:
            <input 
              type="text" 
              name="language" 
              value={language.language} 
              onChange={(e) => handleLanguageChange(index, e)} 
              required 
            />
          </label>
          <label className="label-form-Language">Level:
          {language.level === "Other" ? (
        // Input texte pour un niveau personnalisé
        <input 
          type="text" 
          value={language.customLevel || ""} 
          onChange={(e) => {
            const updatedLanguages = [...languages];
            updatedLanguages[index].customLevel = e.target.value;
            setLanguages(updatedLanguages);
          }}
          placeholder="Enter custom level"
          onBlur={() => {
            const updatedLanguages = [...languages];
            updatedLanguages[index].isEditing = false;
            setLanguages(updatedLanguages);
          }}
          autoFocus
          
        />
      ) : (
        // Sélecteur déroulant normal
        <select 
          name="level" 
          value={language.level} 
          onChange={(e) => {
            const updatedLanguages = [...languages];
            updatedLanguages[index].level = e.target.value;
            // Réinitialise customLevel si un autre niveau est choisi
            if (e.target.value !== "Other") {
              updatedLanguages[index].customLevel = "";
            }
            setLanguages(updatedLanguages);
          }}
          onDoubleClick={() => {
            const updatedLanguages = [...languages];
            updatedLanguages[index].isEditing = true;
            setLanguages(updatedLanguages);
          }}
        >
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Other">Other</option> {/* Affiche un input si sélectionné */}
        </select>
      )}
       </label>
       </div>
        </div>
      ))}
      
          </div>
          <button className="add-button" type="button" onClick={addLanguage}>
        <div className="plus">
          <span className="material-symbols-outlined">add</span>
        </div>
        Add one more language
      </button>
        <button className="next" type="button" onClick={() => setShowCertificationForm(true)}>Next</button>
        </>
      )}

      {/* Certifications Form */}
      {showCertificationForm && !showSkillForm && (
        <>
        <div className="skills-wrapper">
          <h2>Certifications</h2>
          {certifications.map((certification, index) => (
            <div key={index} >
              <div className="row">
              <label className="label-form-Language">Title:
                <input type="text" name="title" value={certification.title} onChange={(e) => handleCertificationChange(index, e)} required />
              </label>
              <label className="label-form-Language">Description:
                <input name="description" value={certification.description} onChange={(e) => handleCertificationChange(index, e)} required />
              </label>
            </div>
            </div>
          ))}
         
          </div>
          <button className="add-button" type="button" onClick={addCertification}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add a certification</button>
          <button className="next" type="button" onClick={() => setShowskillForm(true)}>Next</button>
        </>
        )}


      {/* Skills Form */}
      {showSkillForm && (
        <>
        <div className="skills-wrapper">
          <h2>Skills</h2>

          {skills.map((skill, index) => (
            <div key={index} >
              <div className="row">
              <label className="label-form-Language">Category:
                <input type="text" name="category" value={skill.category} onChange={(e) => handleskillChange(index, e)} required />
              </label>
              <label className="label-form-Language">Details:
                <input name="details" value={skill.details} onChange={(e) => handleskillChange(index, e)} required />
              </label>
              </div>
            </div>
          ))}
                     
        </div>
        <button  className="add-button" type="button" onClick={addskill}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more skill</button>
        <button className="next" type="button" onClick={handleSubmit}>Submit</button>
        </>
        )}
         </>
   );
}

    

export default Forms;
