import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Navbar from "./component/Navbar";
import Home from "./pages/Home";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Navbar />
      </BrowserRouter>
    </div>
  );
}

export default App;
