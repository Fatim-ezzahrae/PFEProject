import { useState, useEffect } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import ResumesList from "./ResumesList";
import CreatedJobOffers from "./CreatedJobOffers";
import "../../styles/Profile.css";
import Sidebar from "../../component/Sidebar";
import { useAuthContext } from "../../hooks/useAuthContext";

const Profile = () => {
  const [activePage, setActivePage] = useState("editProfile"); 
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchJobOffers = async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:4000/api/jobs/${user._id}`);	
        setJobOffers(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching job offers:", error);
        setError("Failed to load job offers");
      }
    }
  };

  useEffect(() => {
    fetchJobOffers();
  }, [user]);

  return (
      <>
      <Sidebar setActivePage={setActivePage} />

      <div className="profile-container">
      
      <div className="content">
        {/* Removed the dashboard view completely */}
        {activePage === "editProfile" && <EditProfile />}
        {activePage === "resumesList" && <ResumesList />}
        {activePage === "createdJobOffers" && (
          <CreatedJobOffers 
            jobOffers={jobOffers}
            setJobOffers={setJobOffers}
            fetchJobOffers={fetchJobOffers}
          />
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;