import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/CVPage.css";
import { useAuthContext } from "../../hooks/useAuthContext";

const CVPage = ({ userInfo, employmentHistory, languages, educationHistory }) => {
  const { user } = useAuthContext();
  const [cvData, setCvData] = useState(null);

  useEffect(() => {
    const fetchCVData = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/resume/${user._id}`);
        setCvData(response.data);
      } catch (error) {
        console.error("Error fetching CV data:", error);
      }
    };
    fetchCVData();
  }, [user._id]);

  if (!cvData) {
    return <div className="cv-container">Loading CV...</div>;
  }

  return (
    <div className="cv-container">
      <h1>{cvData.userInfo.firstName} {cvData.userInfo.lastName}</h1>
      <p>Email: {cvData.userInfo.email}</p>
      <p>Phone: {cvData.userInfo.phone}</p>
      <p>Address: {cvData.userInfo.address}</p>
      
      <h2>Employment History</h2>
      {cvData.employmentHistory.map((job, index) => (
        <div key={index} className="cv-section">
          <h3>{job.position} at {job.company}</h3>
          <p>{job.startDate} - {job.endDate} | {job.city}</p>
          <p>{job.description}</p>
        </div>
      ))}

      <h2>Education</h2>
      {cvData.educationHistory.map((edu, index) => (
        <div key={index} className="cv-section">
          <h3>{edu.degree} from {edu.institute}</h3>
          <p>{edu.startDate} - {edu.endDate} | {edu.city}, {edu.country}</p>
        </div>
      ))}

      <h2>Languages</h2>
      {cvData.languages.map((lang, index) => (
        <p key={index}>{lang.language} - {lang.level}</p>
      ))}
    </div>
  );
};

export default CVPage;
