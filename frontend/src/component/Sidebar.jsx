import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css"; 

const Sidebar  = ({ setActivePage }) => {
  return (
    <div className="sidebar">
        <button onClick={() => setActivePage("profile")} className="icon">
        <span className="material-symbols-outlined">grid_view</span> 
        <span className="label3">Dashboard</span>
      </button>
      <button onClick={() => setActivePage("editProfile")} className="icon">
        <span className="material-symbols-outlined">person</span> 
        <span className="label">Profile</span>
      </button>
      <button onClick={() => setActivePage("resumesList")} className="icon">
        <span className="material-symbols-outlined">docs</span>
        <span className="label1">My Resumes</span>
      </button>
      <button onClick={() => setActivePage("createdJobOffers")} className="icon">
        <span className="material-symbols-outlined">work</span>
        <span className="label2">Created Job Offers</span>
      </button>
    </div>
  );
};

export default Sidebar;
