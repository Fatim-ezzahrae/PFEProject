import { useState, useEffect } from "react";

const EditProfile = () => {
  const [userEmail, setUserEmail] = useState("");



  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center">
      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
        <span className="text-gray-500 text-xl">👤</span>
      </div>
      <div className="ml-4">
        <h2 className="text-lg font-bold">{userEmail }</h2>
        <button className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm shadow">
          ✏️ Edit My Profile
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
