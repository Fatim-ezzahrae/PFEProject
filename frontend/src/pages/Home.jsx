import React from 'react'
import "../styles/Home.css"
import { Link } from 'react-router-dom'
import gifImage from "../assets/Home.gif"

function Home() {
  return (
    <div className="home-container">
      <p className="home-text">
      Kickstart Your Career <br/> with a Powerful Resume <br/> Land Your Dream Job Today!
      </p>
      <div className='animatedGIF'>
      <img src={gifImage} alt="Animated GIF" />
      </div>
      <Link to="/Resumes"  className="home-button">
        Create your Resume
    </Link>
    </div>
  )
}

export default Home;
