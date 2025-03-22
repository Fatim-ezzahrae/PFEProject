import { useState } from "react";
import EditProfile from "./EditProfile";
import ResumesList from "./ResumesList";
import CreatedJobOffers from "./CreatedJobOffers";
import AppliedJobOffers from "./AppliedJobOffers";
import "../../styles/Profile.css";
import Sidebar from "../../component/Sidebar";

const Profile = () => {
  const [activePage, setActivePage] = useState("profile");

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
        {activePage === "createdJobOffers" && <CreatedJobOffers />}
        {activePage === "appliedJobOffers" && <AppliedJobOffers />}
      </div>
    </div>
  );
};

export default Profile;
