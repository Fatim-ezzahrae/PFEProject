import React, { useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/toastNotif.css';  
import ButtonBack from '../../component/ButtonBack.jsx';
import { useAuthContext } from "../../hooks/useAuthContext";
import formsImage from '../../assets/forms.jpg';

const Forms = ({
  currentStep, setCurrentStep,
  userInfo, setUserInfo, 
  employmentHistory, setEmploymentHistory, 
  languages, setLanguages, 
  educationHistory, setEducationHistory,
  certifications, setCertifications,
  showEmploymentForm, setShowEmploymentForm,
  showLanguagesForm, setShowLanguagesForm,
  showEducationForm, setShowEducationForm,
  showCertificationForm, setShowCertificationForm, setSkills, showSkillForm, skills, setShowskillForm,
  selectedTemplateId, generatedResumeURL, setGeneratedResumeURL 
}) =>{

  const { user } = useAuthContext();
  const [years, setYears] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [countries, setCountries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Populate the years from the current year down to 1900
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearOptions.push(year);
    }
    setYears(yearOptions);
  }, []);

  // Toast configuration
  const toastConfig = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: 'toast-notification'
  };

  const showErrorToast = (message) => {
    toast.error(message, toastConfig);
  };

  const showSuccessToast = (message) => {
    toast.success(message, toastConfig);
  };

  const showWarningToast = (message) => {
    toast.warning(message, toastConfig);
  };

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

  const validateForms = () => {
    // Validate user info (required)
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.phone || !userInfo.address) {
      showErrorToast('Please fill in all required personal information fields');
      return false;
    }

    // Validate employment history (required)
    for (const emp of employmentHistory) {
      if (!emp.company || !emp.jobTitle || !emp.startDateEmp || !emp.endDateEmp || !emp.city) {
        showErrorToast('Please fill in all required fields in employment history');
        return false;
      }
      if (emp.description.some(desc => !desc.trim())) {
        showErrorToast('Please fill in all description fields in employment history');
        return false;
      }
    }

    // Validate education history (required)
    for (const edu of educationHistory) {
      if (!edu.institute || !edu.degree || !edu.startDateEdu || !edu.endDateEdu || !edu.city || !edu.country) {
        showErrorToast('Please fill in all required fields in education history');
        return false;
      }
    }

    // Validate languages (optional but must be complete if started)
    for (const lang of languages) {
      if ((lang.language && !lang.level) || (!lang.language && lang.level)) {
        showErrorToast('Please complete both language and level fields for all entered languages');
        return false;
      }
      if (lang.level === "Other" && !lang.customLevel) {
        showErrorToast('Please specify your custom language level');
        return false;
      }
    }

    // Validate certifications (optional but must be complete if started)
    for (const cert of certifications) {
      if ((cert.title && !cert.description) || (!cert.title && cert.description)) {
        showErrorToast('Please complete both title and description fields for all entered certifications');
        return false;
      }
    }

    // Validate skills (required)
    for (const skill of skills) {
      if (!skill.category || !skill.details) {
        showErrorToast('Please fill in all required fields in skills');
        return false;
      }
    }

    // Show warning if no languages entered (but don't block submission)
    if (languages.length === 0) {
      showWarningToast('No languages added - this section will be empty in your resume');
    }

    // Show warning if no certifications entered (but don't block submission)
    if (certifications.length === 0) {
      showWarningToast('No certifications added - this section will be empty in your resume');
    }

    return true;
  };

  const validateCurrentForm = () => {
    if (!showEmploymentForm && !showEducationForm && !showLanguagesForm && 
        !showCertificationForm && !showSkillForm) {
      // Validate user info - checks each field individually
      if (!userInfo.firstName) {
        showErrorToast('Please enter your first name');
        return false;
      }
      if (!userInfo.lastName) {
        showErrorToast('Please enter your last name');
        return false;
      }
      if (!userInfo.email) {
        showErrorToast('Please enter your email');
        return false;
      }
      if (!userInfo.phone) {
        showErrorToast('Please enter your phone number');
        return false;
      }
      if (!userInfo.address) {
        showErrorToast('Please enter your address');
        return false;
      }
    }
    else if (showEmploymentForm) {
      // Validate each employment history entry completely
      for (const [index, emp] of employmentHistory.entries()) {
        if (!emp.company) {
          showErrorToast(`Please enter company name for employment #${index + 1}`);
          return false;
        }
        if (!emp.jobTitle) {
          showErrorToast(`Please enter job title for employment #${index + 1}`);
          return false;
        }
        if (!emp.startDateEmp) {
          showErrorToast(`Please select start date for employment #${index + 1}`);
          return false;
        }
        if (!emp.endDateEmp) {
          showErrorToast(`Please select end date for employment #${index + 1}`);
          return false;
        }
        if (!emp.city) {
          showErrorToast(`Please enter city for employment #${index + 1}`);
          return false;
        }
        if (emp.description.some(desc => !desc.trim())) {
          showErrorToast(`Please fill all description fields for employment #${index + 1}`);
          return false;
        }
      }
    }
    else if (showEducationForm) {
      // Validate each education entry completely
      for (const [index, edu] of educationHistory.entries()) {
        if (!edu.institute) {
          showErrorToast(`Please enter institute name for education #${index + 1}`);
          return false;
        }
        if (!edu.degree) {
          showErrorToast(`Please enter degree for education #${index + 1}`);
          return false;
        }
        if (!edu.startDateEdu) {
          showErrorToast(`Please select start date for education #${index + 1}`);
          return false;
        }
        if (!edu.endDateEdu) {
          showErrorToast(`Please select end date for education #${index + 1}`);
          return false;
        }
        if (!edu.city) {
          showErrorToast(`Please enter city for education #${index + 1}`);
          return false;
        }
        if (!edu.country) {
          showErrorToast(`Please select country for education #${index + 1}`);
          return false;
        }
      }
    }
    else if (showLanguagesForm) {
      // Validate each language entry (only if partially filled)
      for (const [index, lang] of languages.entries()) {
        if ((lang.language && !lang.level) || (!lang.language && lang.level)) {
          showErrorToast(`Please complete both language and level fields for language #${index + 1}`);
          return false;
        }
        if (lang.level === "Other" && !lang.customLevel) {
          showErrorToast(`Please specify level for ${lang.language}`);
          return false;
        }
      }
    }
    else if (showCertificationForm) {
      // Validate each certification entry (only if partially filled)
      for (const [index, cert] of certifications.entries()) {
        if ((cert.title && !cert.description) || (!cert.title && cert.description)) {
          showErrorToast(`Please complete both title and description fields for certification #${index + 1}`);
          return false;
        }
      }
    }
    else if (showSkillForm) {
      // Validate each skill entry completely
      for (const [index, skill] of skills.entries()) {
        if (!skill.category) {
          showErrorToast(`Please enter category for skill #${index + 1}`);
          return false;
        }
        if (!skill.details) {
          showErrorToast(`Please enter details for skill #${index + 1}`);
          return false;
        }
      }
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    if (!validateForms()) {

      // Determine which form has errors and navigate to it
      // if user info form has errors
      if (!userInfo.firstName || !userInfo.lastName || !userInfo.email || 
        !userInfo.phone || !userInfo.address) {
        setShowEmploymentForm(false);
        setShowEducationForm(false);
        setShowLanguagesForm(false);
        setShowCertificationForm(false);
        setShowskillForm(false);
        return;
      }

      // if employment history form has errors
      if (employmentHistory.some(emp => !emp.company || !emp.jobTitle || !emp.startDateEmp || 
        !emp.endDateEmp || !emp.city)) {
        setShowEmploymentForm(true);
        setShowEducationForm(false);
        setShowLanguagesForm(false);
        setShowCertificationForm(false);
        setShowskillForm(false);
        return;
      }

      // if education history form has errors
      if (educationHistory.some(edu => !edu.institute || !edu.degree || !edu.startDateEdu || 
        !edu.endDateEdu || !edu.city || !edu.country)) {
        setShowEmploymentForm(false);
        setShowEducationForm(true);
        setShowLanguagesForm(false);
        setShowCertificationForm(false);
        setShowskillForm(false);
        return;
      }

      // if languages form has errors
      if (languages.some(lang => (lang.language && !lang.level) || (!lang.language && lang.level))) {
        setShowEmploymentForm(false);
        setShowEducationForm(false);
        setShowLanguagesForm(true);
        setShowCertificationForm(false);
        setShowskillForm(false);
        return;
      }

      // if certifications form has errors
      if (certifications.some(cert => (cert.title && !cert.description) || (!cert.title && cert.description))) {
        setShowEmploymentForm(false);
        setShowEducationForm(false);
        setShowLanguagesForm(false);
        setShowCertificationForm(true);
        setShowskillForm(false);
        return;
      }

      // if skills form has errors
      if (skills.some(skill => !skill.category || !skill.details)) {
        setShowEmploymentForm(false);
        setShowEducationForm(false);
        setShowLanguagesForm(false);
        setShowCertificationForm(false);
        setShowskillForm(true);
        return;
      }


      return;
    }

    setIsSubmitting(true);
    showWarningToast('Generating your resume... Please wait.');

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
      // step 1: send informations to backend
      const infoResponse = await axios.post("http://localhost:4000/api/info", {
        userId: user._id,
        userInfo,
        employmentHistory,
        educationHistory,
        skills,
        languages,
        certifications
      });

      if (!infoResponse.data.success) {
        throw new Error(infoResponse.data.error || "Failed to save information");
      }

      showSuccessToast('Your information has been saved successfully!');

      console.log("Selected Template ID:", selectedTemplateId);

      // step 2: generate resume from template and user information
      const response = await axios.get(`http://localhost:4000/api/resume/generate-resume/${selectedTemplateId}/${user._id}`, {
        responseType: 'blob', // Important for PDF
        headers: {
          'Cache-Control': 'no-cache',
        }
      });

      if (response.status === 200) {
        // Create a Blob from the binary data
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob
        setGeneratedResumeURL(fileUrl); // Set the Blob URL to be used in the PDF viewer
        setCurrentStep(3);
        console.log("Resume generated successfully:", response.data);
        showSuccessToast('Resume generated successfully!');
      } else {
        console.error("Error generating resume:", response.data);
        throw new Error("Failed to generate resume");
      }

    } catch (error) {
      console.error("Error submitting CV:", error);

      let errorMessage = "An error occurred while processing your request";
      if (error.response) {
        // Server responded with a status code outside 2xx
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error - please check your connection and try again";
      }

      showErrorToast(errorMessage);
    } finally {
      setIsSubmitting(false);
    }


  };

  return (
    <>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    
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
         <button className="next" type="submit" onClick={() => {
          if (validateCurrentForm()) {
            setShowEmploymentForm(true)
          }
         }}>Next</button>
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
    <button className="next" type="button" onClick={() => {
      if (validateCurrentForm()) {
        setShowEducationForm(true)
      }
      }}>Next</button>
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
                name="startDateEdu"
                value={education.startDateEdu}
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
                name="endDateEdu"
                value={education.endDateEdu}
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
         <button className="next" type="button" onClick={() => {
          if (validateCurrentForm()) {
            setShowLanguagesForm(true)
          }
          }}>Next</button>
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
      <button className="next" type="button" onClick={() => {
        if (validateCurrentForm()) {
          setShowCertificationForm(true)
        }
        }}>Next</button>
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
                <input name="description" placeholder='Ex: 2022' value={certification.description} onChange={(e) => handleCertificationChange(index, e)} required />
              </label>
            </div>
            </div>
          ))}
         
          </div>
          <button className="add-button" type="button" onClick={addCertification}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add a certification</button>
          <button className="next" type="button" onClick={() => {
            if (validateCurrentForm()) {
              setShowskillForm(true)
            }
            }}>Next</button>
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
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <button className="next" type="button" onClick={() => {
          if (validateCurrentForm()) {
            handleSubmit();
          }          
        }} disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Submit'}
        </button>
        <ButtonBack onClick={() => { setShowskillForm(false); setShowCertificationForm(true); }}/>
        </>
        )}
       
      </>
   );
}

    

export default Forms;

