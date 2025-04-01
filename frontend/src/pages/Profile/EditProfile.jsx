import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import "../../styles/EditProfile.css";
import DeleteButton from "../../component/DeleteButt"
import '../../styles/toastNotif.css';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState({ email: "" });
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const handleAccountSettingsChange = (e) => {
    const { name, value } = e.target;
    setAccountSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAccountSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "http://localhost:4000/api/user/account",
        {
          email: accountSettings.email,
          currentPassword: accountSettings.currentPassword,
          newPassword: accountSettings.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

const [accountSettings, setAccountSettings] = useState({
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/user/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      // Handle account deletion success (e.g., logout user)
    } catch (error) {
      // Handle error
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
        headers: { Authorization: `Bearer ${user.token}` }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const profileData = response.data;

      // Validate required data structure
    if (!profileData.personal || !Array.isArray(profileData.certifications) || 
        !Array.isArray(profileData.education) || !Array.isArray(profileData.experience)) {
      throw new Error('Invalid data structure received from server');
    }
      const personal = profileData.personal;
      const certif = profileData.certifications;
      const edu = profileData.education;
      const exp = profileData.experience;

      setUserData({ email: profileData.email });
      
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
        toast.error("Failed to load employment history");
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

      toast.success("Profile data loaded successfully");

    } catch (error) {
      console.error("Error fetching profile data:", error);
    
      let errorMessage = "Failed to load profile data. Please try again.";
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      }
      
      toast.error(errorMessage);
      setErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      const response = await axios.put(
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
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          setShowForm(false);
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update profile. Please try again.");
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
              <input
                type="password"
                name="currentPassword"
                value={accountSettings.currentPassword}
                onChange={handleAccountSettingsChange}
                placeholder="Current password"
                required
              />
            </div>
            
            <div className="Account-settings-field">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={accountSettings.newPassword}
                onChange={handleAccountSettingsChange}
                placeholder="New password"
              />
            </div>
            
            <div className="Account-settings-field">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={accountSettings.confirmPassword}
                onChange={handleAccountSettingsChange}
                placeholder="Confirm new password"
              />
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