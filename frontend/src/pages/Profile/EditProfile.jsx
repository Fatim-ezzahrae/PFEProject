import { useState } from "react";

const EditProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  });

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Saved Data:", userInfo);
  };

  return (
    <div></div>
  );
};

export default EditProfile;
