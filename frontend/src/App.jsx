import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './styles/App.css';
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Resumes from "./pages/Resumes/Resumes.jsx";
import Job from "./pages/Job-offer/Job.jsx";
import SignUp from "./pages/Sign-up"; 
import Profile from "./pages/Profile/Profile.jsx";
function App() {
  return (
    <div className="App">
     
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Resumes" element={<Resumes />} />
          <Route path="/Job" element={<Job />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/Profile" element={<Profile/>} />
        </Routes>
    </div>
  );
}

export default App;
