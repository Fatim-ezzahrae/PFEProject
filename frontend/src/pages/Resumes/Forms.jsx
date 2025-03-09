import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function Forms({ 
  userInfo, setUserInfo, employmentHistory, setEmploymentHistory, skills, setSkills, educationHistory, setEducationHistory,
  showEmploymentForm, setShowEmploymentForm, showSkillsForm, setShowSkillsForm, showEducationForm, setShowEducationForm
}) {

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

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    const newSkills = [...skills];
    newSkills[index][name] = value;
    setSkills(newSkills);
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
  const addEmployment = () => {
    setEmploymentHistory([
      ...employmentHistory,
      {
        jobTitle: "",
        employer: "",
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
        school: "",
        degree: "",
        startDate: null,
        endDate: null,
        city: "",
        description: "",
      },
    ]);
  };

  const addSkill = () => {
    setSkills([...skills, { skill: "", level: "" }]);
  };

  return (
    <>
      {/* User Information Form */}
      {!showEmploymentForm && !showEducationForm && !showSkillsForm && (
        <div className="form-wrapper">
          <h2>Fill in Your Information</h2>          
            <form onSubmit={(e) => e.preventDefault()}>
            <label className="label-form">Name:<input type="text" name="name" value={userInfo.name} onChange={handleInputChange} required /></label>
            <label className="label-form">Email:<input type="email" name="email" value={userInfo.email} onChange={handleInputChange} required /></label>
            <label className="label-form">Phone:<input type="tel" name="phone" value={userInfo.phone} onChange={handleInputChange} required /></label>
            <label className="label-form">Address:<input type="text" name="address" value={userInfo.address} onChange={handleInputChange} required /></label>
            <button className="next" type="submit" onClick={() => setShowEmploymentForm(true)}>Next</button>
          </form>
        </div>
      )}

     {/* Employment Form */}
     {showEmploymentForm && !showEducationForm && !showSkillsForm && (
  <>
    <div className="employment-wrapper">
      <h2>Employment History</h2>
      {employmentHistory.map((employment, index) => (
        <div key={index} className="employment-entry">
          <div className="row">
            <label className="label-form">Job Title:
              <input type="text" name="jobTitle" value={employment.jobTitle} onChange={(e) => handleEmploymentChange(index, e)} required />
            </label>
            <label className="label-form">Employer:
              <input type="text" name="employer" value={employment.employer} onChange={(e) => handleEmploymentChange(index, e)} required />
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
{showEducationForm && !showSkillsForm && (
  <>

  <div className="education-wrapper">
    <h2>Education History</h2>
    {educationHistory.map((education, index) => (
      <div key={index} className="education-entry">
        <div className="row">
          <label className="label-form">School:
            <input type="text" name="school" value={education.school} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
          <label className="label-form">Degree:
            <input type="text" name="degree" value={education.degree} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
        </div>
        <div className="row">
          <label className="label-form">Start Date:
            <div className="date-picker-wrapper">
              <DatePicker 
                selected={education.startDate} 
                onChange={(date) => handleEducationDateChange(index, "startDate", date)}
                dateFormat="yyyy-MM-dd"
                  placeholderText=" Select a date"
                customInput={<input type="text" />}
              />
              <span className="calendar-icon" onClick={() => document.querySelector(`#eduStartDate-${index}`).focus()}>
                <span className="material-symbols-outlined">calendar_month</span>
              </span>
            </div>
          </label>
          <label className="label-form">End Date:
            <div className="date-picker-wrapper">
              <DatePicker 
                selected={education.endDate} 
                onChange={(date) => handleEducationDateChange(index, "endDate", date)}
                dateFormat="yyyy-MM-dd"
                placeholderText=" Select a date"
                customInput={<input type="text" />}
              />
              <span className="calendar-icon" onClick={() => document.querySelector(`#eduEndDate-${index}`).focus()}>
                <span className="material-symbols-outlined">calendar_month</span>
              </span>
            </div>
          </label>
          <label className="label-form city-wrapper">City:
            <input type="text" name="city" value={education.city} onChange={(e) => handleEducationChange(index, e)} required />
          </label>
        </div>
        <label className="label-form">Description:
          <textarea name="description" value={education.description} onChange={(e) => handleEducationChange(index, e)} required />
        </label>
        
      </div>
    ))}
   </div> 
   <button className="add-button" type="button" onClick={addEducation}> <div className="plus"> <span class="material-symbols-outlined"> add </span> </div> Add one more education</button>
    <button className="next" type="button" onClick={() => setShowSkillsForm(true)}>Next</button>
  </>
)}


      {/* Skills Form */}
      {showSkillsForm && (
        <>
        <div className="skills-wrapper">
      <h2>Skills</h2>
      {skills.map((skill, index) => (
        <div key={index} className="skill-entry">
          <label className="label-form-skills">Skill:
            <input 
              type="text" 
              name="skill" 
              value={skill.skill} 
              onChange={(e) => handleSkillChange(index, e)} 
              required 
            />
          </label>
          <label>Level:
            <select 
              name="level" 
              value={skill.level} 
              onChange={(e) => handleSkillChange(index, e)} 
              required
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </label>
        </div>
      ))}
      <button className="add-button" type="button" onClick={addSkill}>
        <div className="plus">
          <span className="material-symbols-outlined">add</span>
        </div>
        Add one more skill
      </button>
    </div>
    <button className="next" type="submit">Submit</button>
          </>
      )}
    </>
  );
}

export default Forms;
