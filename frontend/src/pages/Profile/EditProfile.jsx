import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import "../../styles/EditProfile.css";
import DeleteButton from "../../component/DeleteButt"
import '../../styles/toastNotif.css';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const EditProfile = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({ email: "" });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  const handleAccountSettingsChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAccountSettingsSubmit = async (e) => {
    e.preventDefault();
    try {

      // Client-side validation
      if (!accountSettings.currentPassword) {
          throw new Error("Current password is required");
      }

      if (accountSettings.newPassword && accountSettings.newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters");
      }

      if (accountSettings.newPassword !== accountSettings.confirmPassword) {
          throw new Error("New passwords don't match");
      }
      const response = await axios.put(
        `http://localhost:4000/api/user/${user._id}`,
        {
          email: accountSettings.email,
          currentPassword: accountSettings.currentPassword,
          newPassword: accountSettings.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed");
      }

      // Success handling
      const successMessage = response.data.message || "Account updated successfully";
      toast.success(successMessage, {
        position: "top-right",
        autoClose: 3000,
        onClose: () => {
          // Redirect after toast closes
          if (response.data.token) {
            // If token was refreshed (e.g., email changed)
            localStorage.setItem('user', JSON.stringify({
              ...user,
              email: accountSettings.email,
              token: response.data.token
            }));
          }
          window.location.href = '/profile'; // Redirect to profile page
        }
      });

      // Clear sensitive fields (keep email if it was updated)
      setAccountSettings(prev => ({
        email: prev.email, // Keep updated email
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));


      // Handle success
    } catch (error) {
      let errorMessage = "Failed to update account";
      
      if (error.response) {
        // Server errors
        errorMessage = error.response.data?.message || 
                     `Server error: ${error.response.status}`;
        
        // Special handling for auth errors
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          localStorage.removeItem("user");
          setTimeout(() => window.location.href = '/login', 1500);
        }
      } else if (error.request) {
        // Network errors
        errorMessage = "No response from server. Check your connection.";
      } else {
        // Validation/other errors
        errorMessage = error.message;
      }
  
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000
      });
  
      // Clear sensitive fields on error
      setAccountSettings(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
  };

const [accountSettings, setAccountSettings] = useState({
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});

useEffect(() => {
  // Reset all form states when user changes
  setAccountSettings({
    email: user?.email || "",  // Only pre-populate email
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

}, [user]); // Trigger when user changes
const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
const handleDeleteAccount = async () => {
  try {

    const response = await axios.delete(
      `http://localhost:4000/api/user/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      // Success toast
      toast.success("Account deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Logout and redirect after a delay
      setTimeout(() => {
        localStorage.removeItem('user');
        window.location.href = '/';
      }, 1300); // Wait for toast to show
    }
  } catch (error) {
    console.error("Account deletion failed:", error);

    // Error toast
    toast.error(
      error.response?.data?.message || "Failed to delete account", 
      {
        position: "top-right",
        autoClose: 5000,
      }
    );
  }
};

  // Form states
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [employmentHistory, setEmploymentHistory] = useState([{
    company: "",
    jobTitle: "",
    startDateEmp: "",
    endDateEmp: "",
    city: "",
    description: [""]
  }]);
  
  const [educationHistory, setEducationHistory] = useState([{
    institute: "",
    degree: "",
    startDateEdu: "",
    endDateEdu: "",
    city: "",
    country: ""
  }]);
  
  const [languages, setLanguages] = useState([{
    language: "",
    level: "",
    customLevel: ""
  }]);
  
  const [certifications, setCertifications] = useState([{
    title: "",
    description: ""
  }]);
  
  const [skills, setSkills] = useState([{
    category: "",
    details: ""
  }]);
  
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Generate years from current year to 1900
    const currentYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = currentYear; year >= 1900; year--) {
      yearOptions.push(year);
    }
    setYears(yearOptions);

    // Fetch countries
    axios.get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const sortedCountries = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });

    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/info/retreive/${user._id}`, {
        headers: { 
          Authorization: `Bearer ${user.token}`,
          validateStatus: (status) => status < 500 // Don't throw for 404
        }
      });

      // Handle empty response or new user case
      if (!response.data || response.status === 404) {
        return initializeEmptyProfile(); // Silent handling for new users
      }

      // Use response data if available, otherwise use empty template
      const profileData = response.data;

      setUserData({ email: user.email }); // Always use auth context email

      // Validate structure (will pass for emptyProfile)
      if (!profileData.personal || !Array.isArray(profileData.certifications) || 
          !Array.isArray(profileData.education) || !Array.isArray(profileData.experience)) {
        throw new Error('Invalid data structure received');
      }
      const personal = profileData.personal;
      const certif = profileData.certifications;
      const edu = profileData.education;
      const exp = profileData.experience;
      
      setUserInfo({
        firstName: personal.firstName || "",
        lastName: personal.lastName || "",
        email: personal.email || "",
        phone: personal.phone || "",
        address: personal.address || ""
      });

      // Set employment history with validation
      try {
        setEmploymentHistory(
          exp.length > 0 && exp[0]?.experience?.length > 0
            ? exp[0].experience 
            : [{ company: "", jobTitle: "", startDateEmp: "", endDateEmp: "", city: "", description: [""] }]
        );
      } catch (e) {
        console.error("Error setting employment history:", e);
        //toast.error("Failed to load employment history");
        setEmploymentHistory([{ company: "", jobTitle: "", startDateEmp: "", endDateEmp: "", city: "", description: [""] }]);
      }

      // Set education history with validation
      try {
        setEducationHistory(
          edu.length > 0 && edu[0]?.education?.length > 0
            ? edu[0].education 
            : [{ institute: "", degree: "", startDateEdu: "", endDateEdu: "", city: "", country: "" }]
        );
      } catch (e) {
        console.error("Error setting education history:", e);
        toast.error("Failed to load education history");
        setEducationHistory([{ institute: "", degree: "", startDateEdu: "", endDateEdu: "", city: "", country: "" }]);
      }

      // Set languages with validation
      try {
        setLanguages(
          personal.languages?.length > 0
            ? personal.languages
            : [{ language: "", level: "", customLevel: "" }]
        );
      } catch (e) {
        console.error("Error setting languages:", e);
        toast.error("Failed to load languages");
        setLanguages([{ language: "", level: "", customLevel: "" }]);
      }

      // Set certifications with validation
      try {
        setCertifications(
          certif.length > 0 && certif[0]?.certifications?.length > 0
            ? certif[0].certifications
            : [{ title: "", description: "" }]
        );
      } catch (e) {
        console.error("Error setting certifications:", e);
        toast.error("Failed to load certifications");
        setCertifications([{ title: "", description: "" }]);
      }

      // Set skills with validation
      try {
        setSkills(
          personal.skills?.length > 0
            ? personal.skills
            : [{ category: "", details: "" }]
        );
      } catch (e) {
        console.error("Error setting skills:", e);
        toast.error("Failed to load skills");
        setSkills([{ category: "", details: "" }]);
      }

    } catch (error) {
      console.error("Error fetching profile data:", error);
    
      let errorMessage = "Failed to load profile data. Please try again.";

      if (error.response?.status !== 404) { // Don't show toast for new users
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      }
      initializeEmptyProfile(); // Fallback to empty form
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function for empty profile initialization
const initializeEmptyProfile = () => {
  // Initialize empty form for new users
  setUserInfo({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  setEmploymentHistory([{ company: "", jobTitle: "", startDateEmp: "", endDateEmp: "", city: "", description: [""] }]);
  setEducationHistory([{ institute: "", degree: "", startDateEdu: "", endDateEdu: "", city: "", country: "" }]);
  setLanguages([{ language: "", level: "", customLevel: "" }]);
  setCertifications([{ title: "", description: "" }]);
  setSkills([{ category: "", details: "" }]);
}

  // Handler functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleEmploymentChange = (index, e) => {
    const { name, value } = e.target;
    setEmploymentHistory(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const handleDescriptionChange = (empIndex, descIndex, e) => {
    setEmploymentHistory(prev => 
      prev.map((employment, i) => 
        i === empIndex ? {
          ...employment,
          description: employment.description.map((desc, j) => 
            j === descIndex ? e.target.value : desc
          )
        } : employment
      )
    );
  };

  const handleAddDescription = (index) => {
    setEmploymentHistory(prev => 
      prev.map((employment, i) => 
        i === index ? {
          ...employment,
          description: [...employment.description, ""]
        } : employment
      )
    );
  };

  const addEmployment = () => {
    setEmploymentHistory(prev => [
      ...prev,
      {
        company: "",
        jobTitle: "",
        startDateEmp: "",
        endDateEmp: "",
        city: "",
        description: [""]
      }
    ]);
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    setEducationHistory(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addEducation = () => {
    setEducationHistory(prev => [
      ...prev,
      {
        institute: "",
        degree: "",
        startDateEdu: "",
        endDateEdu: "",
        city: "",
        country: ""
      }
    ]);
  };

  const handleLanguageChange = (index, e) => {
    const { name, value } = e.target;
    setLanguages(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addLanguage = () => {
    setLanguages(prev => [
      ...prev,
      {
        language: "",
        level: "",
        customLevel: ""
      }
    ]);
  };

  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    setCertifications(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addCertification = () => {
    setCertifications(prev => [
      ...prev,
      {
        title: "",
        description: ""
      }
    ]);
  };

  const handleSkillChange = (index, e) => {
    const { name, value } = e.target;
    setSkills(prev => 
      prev.map((item, i) => 
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const addSkill = () => {
    setSkills(prev => [
      ...prev,
      {
        category: "",
        details: ""
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const response = await axios.post(
        `http://localhost:4000/api/info`,
        {
          userId: user._id,
          userInfo,
          employmentHistory,
          educationHistory,
          languages,
          certifications,
          skills
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10-second timeout
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed without error message");
      }
  
      // Success toast
      toast.success(response.data.message || "Profile updated successfully!", {
        position: "top-right",
        autoClose: 1000,
        onClose: () => setShowForm(false) // Close form after toast disappears
      });

    } catch (error) {
      let errorMsg = "Failed to update profile. Please try again.";
    
      if (error.response) {
        // Server responded with error status
        errorMsg = error.response.data?.message || 
                  `Server error: ${error.response.status}`;
        
        // Special handling for auth errors
        if (error.response.status === 401) {
          errorMsg = "Session expired. Please log in again.";
          localStorage.removeItem("user");
        }
      } else if (error.request) {
        errorMsg = "No response from server. Check your connection.";
      }

      console.error("Profile update error:", {
        error: error.message,
        stack: error.stack,
        response: error.response?.data
      });

      // Error toast
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000
      });
    }
  };

  

  return (
    <div className="Edit-profile-page">
      <ToastContainer position="top-right" autoClose={5000} />
      {!showForm && !showAccountSettings &&  (
        <div className="Edit-profile-container">
          <div className="Edit-profile-header">
          <div className="Edit-profile-name">
            {userInfo.firstName} {userInfo.lastName}
          </div>
          <div className="Edit-profile-actions">
            <button 
              className="Edit-edit-btn" 
              onClick={() => setShowForm(true)}
            >
              <span className="material-symbols-outlined">edit</span>
              Edit Profile
            </button>
            <button 
              className="Edit-settings-btn"
              onClick={() => setShowAccountSettings(true)}
            >
              <span className="material-symbols-outlined">settings</span>
              Account Settings
            </button>
          </div>
        </div>
                </div>
      )}
      {showForm && (
        <div className="Edit-profile-form">
          <h1>Edit My Career Profile</h1>
          
          {errorMessage && <div className="Edit-error-message">{errorMessage}</div>}
          {successMessage && <div className="Edit-success-message">{successMessage}</div>}

          {/* Personal Information */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Personal Information</h3>
            <div className="Edit-form-card">
              <div className="Edit-form-row">
                <label className="Edit-form-label">
                  First Name:
                  <input
                    type="text"
                    name="firstName"
                    className="Edit-form-input"
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label className="Edit-form-label">
                  Last Name:
                  <input
                    type="text"
                    name="lastName"
                    className="Edit-form-input"
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </label>
              </div>
              
              <label className="Edit-form-label">
                Email:
                <input
                  type="email"
                  name="email"
                  className="Edit-form-input"
                  value={userInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              
              <label className="Edit-form-label">
                Phone:
                <input
                  type="tel"
                  name="phone"
                  className="Edit-form-input"
                  value={userInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>
              
              <label className="Edit-form-label">
                Address:
                <input
                  type="text"
                  name="address"
                  className="Edit-form-input"
                  value={userInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </label>
            </div>
          </div>

          {/* Employment History */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Employment History</h3>
            {employmentHistory.map((employment, index) => (
              <div key={index} className="Edit-form-card">
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Company:
                    <input
                      type="text"
                      name="company"
                      className="Edit-form-input"
                      value={employment.company}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      required
                    />
                  </label>
                  <label className="Edit-form-label">
                    Job Title:
                    <input
                      type="text"
                      name="jobTitle"
                      className="Edit-form-input"
                      value={employment.jobTitle}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      required
                    />
                  </label>
                </div>
                
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Start Year:
                    <select
                      name="startDateEmp"
                      className="Edit-form-select"
                      value={employment.startDateEmp}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label className="Edit-form-label">
                    End Year:
                    <select
                      name="endDateEmp"
                      className="Edit-form-select"
                      value={employment.endDateEmp}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="Present">Present</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label className="Edit-form-label">
                    City:
                    <input
                      type="text"
                      name="city"
                      className="Edit-form-input"
                      value={employment.city}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      required
                    />
                  </label>
                </div>
                
                <label className="Edit-form-label">Description:</label>
                {employment.description.map((desc, descIndex) => (
                  <input
                    key={descIndex}
                    type="text"
                    className="Edit-form-input Edit-description-input"
                    value={desc}
                    onChange={(e) => handleDescriptionChange(index, descIndex, e)}
                    required
                  />
                ))}
                
                <button
                  type="button"
                  className="Edit-add-desc-btn"
                  onClick={() => handleAddDescription(index)}
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Add Description
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="Edit-add-item-btn"
              onClick={addEmployment}
            >
              <span className="Edit-icon">+</span> Add Employment
            </button>
          </div>

          {/* Education */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Education</h3>
            {educationHistory.map((education, index) => (
              <div key={index} className="Edit-form-card">
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Institute:
                    <input
                      type="text"
                      name="institute"
                      className="Edit-form-input"
                      value={education.institute}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    />
                  </label>
                  <label className="Edit-form-label">
                    Degree:
                    <input
                      type="text"
                      name="degree"
                      className="Edit-form-input"
                      value={education.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    />
                  </label>
                </div>
                
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Start Year:
                    <select
                      name="startDateEdu"
                      className="Edit-form-select"
                      value={education.startDateEdu}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    >
                      <option value="">Select Year</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                  
                  <label className="Edit-form-label">
                    End Year:
                    <select
                      name="endDateEdu"
                      className="Edit-form-select"
                      value={education.endDateEdu}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    >
                      <option value="">Select Year</option>
                      <option value="Present">Present</option>
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </label>
                </div>
                
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    City:
                    <input
                      type="text"
                      name="city"
                      className="Edit-form-input"
                      value={education.city}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    />
                  </label>
                  
                  <label className="Edit-form-label">
                    Country:
                    <select
                      name="country"
                      className="Edit-form-select"
                      value={education.country || ''}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.cca2} value={country.name.common}>
                          {country.name.common}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="Edit-add-item-btn"
              onClick={addEducation}
            >
              <span className="Edit-icon">+</span> Add Education
            </button>
          </div>

          {/* Languages */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Languages</h3>
            {languages.map((language, index) => (
              <div key={index} className="Edit-form-card">
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Language:
                    <input
                      type="text"
                      name="language"
                      className="Edit-form-input"
                      value={language.language}
                      onChange={(e) => handleLanguageChange(index, e)}
                      required
                    />
                  </label>
                  
                  <label className="Edit-form-label">
                    Level:
                    {language.level === "Other" ? (
                      <input
                        type="text"
                        name="customLevel"
                        className="Edit-form-input"
                        value={language.customLevel}
                        onChange={(e) => handleLanguageChange(index, e)}
                        placeholder="Enter level"
                        required
                      />
                    ) : (
                      <select
                        name="level"
                        className="Edit-form-select"
                        value={language.level}
                        onChange={(e) => handleLanguageChange(index, e)}
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </label>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="Edit-add-item-btn"
              onClick={addLanguage}
            >
              <span className="Edit-icon">+</span> Add Language
            </button>
          </div>

          {/* Certifications */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Certifications</h3>
            {certifications.map((certification, index) => (
              <div key={index} className="Edit-form-card">
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Title:
                    <input
                      type="text"
                      name="title"
                      className="Edit-form-input"
                      value={certification.title}
                      onChange={(e) => handleCertificationChange(index, e)}
                      required
                    />
                  </label>
                  <label className="Edit-form-label">
                    Description:
                    <input
                      type="text"
                      name="description"
                      className="Edit-form-input"
                      value={certification.description}
                      onChange={(e) => handleCertificationChange(index, e)}
                      required
                    />
                  </label>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="Edit-add-item-btn"
              onClick={addCertification}
            >
              <span className="Edit-icon">+</span> Add Certification
            </button>
          </div>

          {/* Skills */}
          <div className="Edit-form-section">
            <h3 className="Edit-section-title">Skills</h3>
            {skills.map((skill, index) => (
              <div key={index} className="Edit-form-card">
                <div className="Edit-form-row">
                  <label className="Edit-form-label">
                    Category:
                    <input
                      type="text"
                      name="category"
                      className="Edit-form-input"
                      value={skill.category}
                      onChange={(e) => handleSkillChange(index, e)}
                      required
                    />
                  </label>
                  <label className="Edit-form-label">
                    Details:
                    <input
                      type="text"
                      name="details"
                      className="Edit-form-input"
                      value={skill.details}
                      onChange={(e) => handleSkillChange(index, e)}
                      required
                    />
                  </label>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="Edit-add-item-btn"
              onClick={addSkill}
            >
              <span className="Edit-icon">+</span> Add Skill
            </button>
          </div>

                   {/* Form Buttons */}
             <div className="Edit-form-buttons">
            <button
              type="button"
              className="Edit-submit-btn"
              onClick={handleSubmit}
            >
              Save Profile
            </button>
            <button
              type="button"
              className="Edit-cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Account Settings Form */}
      {showAccountSettings && !showForm && (
        <div className="Account-settings-form">
          <h1>Account Settings</h1>
          
          <form onSubmit={handleAccountSettingsSubmit}>
            <div className="Account-settings-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={accountSettings.email}
                onChange={handleAccountSettingsChange}
                placeholder="New email"
              />
            </div>
            
            <div className="Account-settings-field">
              <label>Current Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={accountSettings.currentPassword}
                  onChange={handleAccountSettingsChange}
                  placeholder="Current password"
                  required
                />
                <FontAwesomeIcon 
                  icon={showPasswords.current ? faEye : faEyeSlash} 
                  onClick={() => togglePasswordVisibility('current')}
                  className="password-toggle-icon"
                />
              </div>
            </div>

            <div className="Account-settings-field">
              <label>New Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={accountSettings.newPassword}
                  onChange={handleAccountSettingsChange}
                  placeholder="New password"
                />
                <FontAwesomeIcon 
                  icon={showPasswords.new ? faEye :  faEyeSlash} 
                  onClick={() => togglePasswordVisibility('new')}
                  className="password-toggle-icon"
                />
              </div>
            </div>

            <div className="Account-settings-field">
              <label>Confirm Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={accountSettings.confirmPassword}
                  onChange={handleAccountSettingsChange}
                  placeholder="Confirm new password"
                />
                <FontAwesomeIcon 
                  icon={showPasswords.confirm ?faEye  :faEyeSlash } 
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="password-toggle-icon"
                />
              </div>
            </div>
            <div className="Account-settings-buttons">
              <button type="submit" className="Account-settings-save">
                Save Changes
              </button>
              <button 
                type="button" 
                className="Account-settings-cancel"
                onClick={() => setShowAccountSettings(false)}
              >
                Cancel
              </button>
            </div>
          </form>
          
          <div className="Account-delete-section">
            <p><span class="material-symbols-outlined">warning</span>This action cannot be undone. All your data will be permanently deleted.</p>
            
            {deleteConfirmation ? (
              <div className="Delete-confirmation">
                <p>Are you sure you want to delete your account?</p>
                <button 
                  className="Delete-confirm"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete My Account
                </button>
                <button 
                  className="Delete-cancel"
                  onClick={() => setDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            ) : (
             
                <DeleteButton onClick={() => setDeleteConfirmation(true)} />
              
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;