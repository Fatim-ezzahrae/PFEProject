import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import ButtonBack from '../../component/ButtonBack.jsx';
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
  const [years, setYears] = useState([]);

  useEffect(() => {
    // Populate the years from the current year down to 1900
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearOptions.push(year);
    }
    setYears(yearOptions);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleEmploymentChange = (index, event) => {
    const { name, value } = event.target;
    setEmploymentHistory((prevEmploymentHistory) =>
      prevEmploymentHistory.map((employment, i) =>
        i === index ? { ...employment, [name]: value } : employment
      )
    );
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
        jobTitle: "",
        startDateEmp:null,
        endDateEmp: null,
        city: "",
        description: [""],
      },
    ]);
  };

  const addEducation = () => {
    setEducationHistory([
      ...educationHistory,
      {
        institute: "",
        degree: "",
        startDateEdu: null,
        endDateEdu: null,
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


  const handleAddDescription = (index) => {
    setEmploymentHistory((prevEmploymentHistory) =>
      prevEmploymentHistory.map((employment, i) =>
        i === index
          ? { 
              ...employment, 
              description: [...employment.description, ""] 
            }
          : employment
      )
    );
  };
  
  
  
  const handleDescriptionChange = (empIndex, descIndex, e) => {
    const updatedEmploymentHistory = [...employmentHistory];
    updatedEmploymentHistory[empIndex].description[descIndex] = e.target.value;
    setEmploymentHistory(updatedEmploymentHistory);
  };
  
  const handleSubmit = async () => {
    try {
      console.log({
        userId: user._id,
        userInfo,
        employmentHistory,
        educationHistory,
        skills,
        languages,
        certifications
      }); 
      const response = await axios.post("http://localhost:4000/api/info", {
        userId: user._id,
        userInfo,
        employmentHistory,
        educationHistory,
        skills,
        languages,
        certifications
      });
  
      if (response.data.success) {
        alert("CV submitted successfully!");
        setCurrentStep(3); 
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
            <label className="label-form">First Name:<input type="text" name="firstName" placeholder="Enter your First Name..." value={userInfo.firstName} onChange={handleInputChange} required /></label>
            <label className="label-form">Last Name:<input type="text" name="lastName"  placeholder="Enter your Last Name..." value={userInfo.lastName} onChange={handleInputChange} required /></label>
            </div>
            <label className="label-form">Email:<input type="email" name="email"  placeholder="ex: xx@gmail.com" value={userInfo.email} onChange={handleInputChange} required /></label>
            <label className="label-form">Phone:<input type="tel" name="phone"  placeholder="ex: XXXXXXXXXX" value={userInfo.phone} onChange={handleInputChange} required /></label>
            <label className="label-form">Address:<input type="text" name="address"  placeholder="Enter your address..." value={userInfo.address} onChange={handleInputChange} required /></label>
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
        <div key={index} className="form-box">
          <div className="row">
            <label className="label-form">Company:
              <input type="text" name="company" placeholder="Enter your company name..." value={employment.company} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
            <label className="label-form">Job Title:
              <input type="text" name="jobTitle" placeholder="Enter your Job Title..." value={employment.jobTitle} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
          </div>
          <div className="row">
             {/* Start Year Dropdown */}
             <label className="label-form">Start Year:
              <select 
                className="date-picker-wrapper" 
                name="startDateEmp" 
                value={employment.startDateEmp} 
                onChange={(e) => handleEmploymentChange(index, e)}
                required
              >
                <option value="">Select Start Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>

            <label className="label-form">End Year:
              <select 
                className="date-picker-wrapper"
                name="endDateEmp" 
                value={employment.endDateEmp} 
                onChange={(e) => handleEmploymentChange(index, e)}
                required
              >
                <option value="">Select End Year</option>
                <option value="Now">Now</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>
            <label className="label-form city-wrapper">City:
              <input type="text" name="city" placeholder="Enter your City..." value={employment.city} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
          </div>
                {/* Description*/}
                <label className="label-form">Description:</label>
                {(employment.description.length === 0 ? [""] : employment.description).map((desc, descIndex) => (
                 
                    <input type="text"
                    className='descp'
                      name="description"
                      placeholder="Ex: Provided customer support and resolved technical issues"
                      value={desc}
                      onChange={(e) => handleDescriptionChange(index, descIndex, e)}
                      required
                    />
                
                ))}


    <button className="descButt" type="button" onClick={() => handleAddDescription(index)}><span class="material-symbols-outlined">add_circle</span></button>
        </div>
      ))}          
    </div>
    <button  className="add-button" type="button" onClick={addEmployment}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more employment</button>
    <button className="next" type="button" onClick={() => setShowEducationForm(true)}>Next</button>
    <ButtonBack onClick={() => { setShowEmploymentForm(false); }} />
             
      </>
      )}


    {/* Education from */}
    {showEducationForm && !showLanguagesForm && !showCertificationForm && !showSkillForm && (
      <>

    <div className="education-wrapper">
    <h2>Education History</h2>
    {educationHistory.map((education, index) => (
      <div key={index} className="form-box">
        <div className="row">
          <label className="label-form">Institute:
            <input type="text" name="institute" placeholder="Enter your Institute name..." value={education.institute} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
          <label className="label-form">Degree:
            <input type="text" name="degree" placeholder="Enter your Degree..." value={education.degree} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
        </div>
        <div className="row">
          {/* Start Year Dropdown */}
          <label className="label-form">Start Year:
              <select 
                className="date-picker-wrapper" 
                name="startYearEdu"
                value={education.startYearEdu}
                onChange={(e) => handleEducationChange(index, e)}
                required
              >
                <option value="">Select Start Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label>

            {/* End Year Dropdown */}
            <label className="label-form">End Year:
              <select  
                className="date-picker-wrapper"
                name="endYearEdu"
                value={education.endYearEdu}
                onChange={(e) => handleEducationChange(index, e)}
                required
              >
                <option value="">Select End Year</option>
                <option value="Now">Now</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </label> 
               </div>                      
           <div className="row">
          <label className="label-form ">City:
            <input type="text" placeholder="Enter your City..." name="city" value={education.city} onChange={(e) => handleEducationChange(index, e)} required />
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
         <ButtonBack onClick={() => { setShowEducationForm(false); setShowEmploymentForm(true); }}/>
        </>
      )}


      {/* Language Form */}
      {showLanguagesForm && !showCertificationForm && !showSkillForm && (
      <>
        <div className="Language-wrapper">
      <h2>Languages</h2>
      
      {languages.map((language, index) => (
        <div key={index} className="form-box" >
          <div className="row">
          <label className="label-form-Language">Language:
            <input 
              type="text" 
              name="language" 
              placeholder="Ex: Arabic, French, English..."
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
          <option value="">Select your Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Other">Other</option> 
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
      <ButtonBack onClick={() => { setShowLanguagesForm(false); setShowEducationForm(true); }}/> 
       </>
      )}

      {/* Certifications Form */}
      {showCertificationForm && !showSkillForm && (
        <>
        <div className="skills-wrapper">
          <h2>Certifications</h2>
          {certifications.map((certification, index) => (
            <div key={index} className="form-box" >
              <div className="row">
              <label className="label-form-Language" >Title:
                <input type="text" name="title" placeholder="Ex: AWS Certified Solutions Architect"value={certification.title} onChange={(e) => handleCertificationChange(index, e)} required />
              </label>
              <label className="label-form-Language">Description:
                <input name="description" placeholder='Enter a brief description' value={certification.description} onChange={(e) => handleCertificationChange(index, e)} required />
              </label>
            </div>
            </div>
          ))}
         
          </div>
          <button className="add-button" type="button" onClick={addCertification}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add a certification</button>
          <button className="next" type="button" onClick={() => setShowskillForm(true)}>Next</button>
          <ButtonBack onClick={() => { setShowCertificationForm(false); setShowLanguagesForm(true); }}/>
        </>
        )}


      {/* Skills Form */}
      {showSkillForm && (
        <>
        <div className="skills-wrapper">
          <h2>Skills</h2>

          {skills.map((skill, index) => (
            <div key={index} className="form-box">
              <div className="row">
              <label className="label-form-Language">Category:
                <input type="text" name="category" placeholder="Ex: Programming..." value={skill.category} onChange={(e) => handleskillChange(index, e)} required />
              </label>
              <label className="label-form-Language">Details:
                <input name="details" placeholder="Ex: Phyton,Javascript..." value={skill.details} onChange={(e) => handleskillChange(index, e)} required />
              </label>
              </div>
            </div>
          ))}
                     
        </div>
        <button  className="add-button" type="button" onClick={addskill}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more skill</button>
        <button className="next" type="button" onClick={handleSubmit}>Submit</button>
        <ButtonBack onClick={() => { setShowskillForm(false); setShowCertificationForm(true); }}/>
        </>
        )}
         </>
   );
}

    

export default Forms;
