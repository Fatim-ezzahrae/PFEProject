import { useState, useEffect } from "react";
import axios from "axios";
import EditProfile from "./EditProfile";
import ResumesList from "./ResumesList";
import CreatedJobOffers from "./CreatedJobOffers";
import AppliedJobOffers from "./AppliedJobOffers";
import "../../styles/Profile.css";
import Sidebar from "../../component/Sidebar";
import { useAuthContext } from "../../hooks/useAuthContext";

const Profile = () => {
  const [activePage, setActivePage] = useState("profile");
  const [jobOffers, setJobOffers] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchJobOffers = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:4000/api/jobs/${user._id}`);	
          setJobOffers(response.data);
        } catch (error) {
          console.error("Error fetching job offers:", error);
        }
      }
    };

    fetchJobOffers();
  }, [user]);

  return (
    <div className="profile-container">
      <Sidebar setActivePage={setActivePage} />
      <div className="content">
      {activePage === "profile" && (
          <div>
            <h2>Welcome to Your Profile</h2>
            {/* Add any profile-related content here */}
          </div>
        )}
        {activePage === "editProfile" && <EditProfile />}
        {activePage === "resumesList" && <ResumesList />}
        {activePage === "createdJobOffers" && <CreatedJobOffers 
          jobOffers={jobOffers}
        />}
        {activePage === "appliedJobOffers" && <AppliedJobOffers />}
      </div>
    </div>
  );
};

export default Profile;

