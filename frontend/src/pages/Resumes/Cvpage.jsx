// src/pages/Resumes/CVPage.jsx
import React from "react";

const Cvpage = ({ userInfo, employmentHistory, skills, educationHistory }) => {
  return (
    <div className="cv-page">
      <h2>Your CV</h2>
      <div className="user-info">
        <h3>{userInfo.name}</h3>
        <p>Email: {userInfo.email}</p>
        <p>Phone: {userInfo.phone}</p>
        <p>Address: {userInfo.address}</p>
      </div>

      <div className="employment-history">
        <h3>Employment History</h3>
        {employmentHistory.map((employment, index) => (
          <div key={index}>
            <h4>{employment.jobTitle} at {employment.employer}</h4>
            <p>{employment.startDate} - {employment.endDate}</p>
            <p>{employment.city}</p>
            <p>{employment.description}</p>
          </div>
        ))}
      </div>

      <div className="education-history">
        <h3>Education History</h3>
        {educationHistory.map((education, index) => (
          <div key={index}>
            <h4>{education.degree} from {education.school}</h4>
            <p>{education.startDate} - {education.endDate}</p>
            <p>{education.city}</p>
            <p>{education.description}</p>
          </div>
        ))}
      </div>

      <div className="skills">
        <h3>Skills</h3>
        {skills.map((skill, index) => (
          <div key={index}>
            <h4>{skill.skill}</h4>
            <p>Level: {skill.level}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cvpage;
