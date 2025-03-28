import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import "../../styles/Profile.css"; 

const EditProfile = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: ""
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/user", {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setUserData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <div className="profile-header-container">
      <div className="profile-name">
        {userData.firstName} {userData.lastName}
      </div>
      <div className="profile-email">{userData.email}</div>
      <button className="edit-profile-button">Edit My Profile</button>
    </div>
  );
};

export default EditProfile;