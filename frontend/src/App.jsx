import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Resumes from "./pages/Resumes";
import Job from "./pages/Job";
import SignUp from "./pages/Sign-up"; 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Resumes" element={<Resumes />} />
          <Route path="/job" element={<Job />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
