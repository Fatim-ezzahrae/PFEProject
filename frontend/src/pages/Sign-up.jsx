import React, { useState } from 'react';
import '../styles/Signup.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import axios from 'axios';
import { useSignup } from "../hooks/useSignup"
import { useLogin } from "../hooks/useLogin"




const Signup = () => {
  const [email, setEmail] = useState('');  // For storing the email
  const [password, setPassword] = useState('');  // For storing the password
  const {signup, errorSignup, isLoadingSignup} = useSignup()
  const {login, errorLogin, isLoadingLogin} = useLogin()

  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();  // Prevent the page from refreshing when the form is submitted
      await signup(email, password)
  };  


  const handleSignInSubmit = async (e) => {
    e.preventDefault();  // Prevent the default form submission behavior
    await login(email, password)
  };
  
  const handleSignUpClick = () => {
    setIsSignUp(true);  
  }; // Set to sign-up mode

  const handleSignInClick = () => {
    setIsSignUp(false);  
  }; // Set to sign-in mode

  return (
    <>
      <div className={`Sign-container ${isSignUp ? 'right-panel-active' : ''}`}>
        <div className="form-container sign-up-container">
          <form className='Sign-up1' onSubmit={handleSignUpSubmit}>
            <h1 className='Sign-up8'>Sign Up</h1>
            

            <div className="Sign-up-input-container"> <div className='Sign-up-icon'>
            <span class="material-symbols-outlined">mail</span>
            </div>
            <input 
              className="Sign-up3" 
              type="email" 
              placeholder="Email" 
              value={email}  // Bind to the 'email' state variable
              onChange={(e) => setEmail(e.target.value)}  // Update the 'email' state when user types
            />
            </div>
            
            <div className="Sign-up-input-container">
            <div className='Sign-up-icon'>
              <span className="material-symbols-outlined">lock</span>
            </div>
            <input 
              className="Sign-up3" 
              type={showPasswordSignUp ? "text" : "password"} 
              placeholder="Password" 
              value={password}  // Bind to the 'password' state variable
              onChange={(e) => setPassword(e.target.value)}  // Update the 'password' state when user types
            />
            <button 
              type="button" 
              className="toggle-password" 
              onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
            >
              <FontAwesomeIcon icon={showPasswordSignUp ? faEye : faEyeSlash} />
            </button>
            </div>
            <button className='Sign-up' type="submit" disabled={isLoadingSignup}>Sign Up</button>
            {errorSignup && <p className='error-message'>{errorSignup}</p>}
          </form>
        </div>
        
        


        {/* Sign In */}
        <div className="form-container sign-in-container">
          <form className='Sign-up1' onSubmit={handleSignInSubmit}>
            <h1 className='Sign-up8'>Sign In</h1>
            <div className="Sign-up-input-container">
            <div className='Sign-up-icon'>
            <span class="material-symbols-outlined">mail</span>
            </div>
            <input 
              className="Sign-up3" 
              type="email" 
              placeholder="Email" 
              value={email}  // Bind to the 'email' state variable
              onChange={(e) => setEmail(e.target.value)}  // Update the 'email' state when user types
            />
            </div>


            <div className="Sign-up-input-container">
            <div className='Sign-up-icon'>
             <span className="material-symbols-outlined">lock</span>
             </div>
             <input 
              className="Sign-up3" 
              type={showPasswordSignUp ? "text" : "password"} 
              placeholder="Password" 
              value={password}  // Bind to the 'password' state variable
              onChange={(e) => setPassword(e.target.value)}  // Update the 'password' state when user types
            />
             <button 
               type="button" 
                className="toggle-password" 
                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
             >
                <FontAwesomeIcon icon={showPasswordSignIn ? faEye : faEyeSlash} />
              </button>
            </div>


            <a className='Sign-up5' href="#">Forgot your password?</a>
            <button className='Sign-up' type="submit" disabled={isLoadingLogin}>Sign In</button>
            {errorLogin && <p className='error-message'>{errorLogin}</p>}
          </form>
        </div>
        

        <div className="Sign-up-overlay-container">
          <div className="Sign-up-overlay">
            <div className="Sign-up-overlay-panel overlay-left">
              <h1 className='Sign-up6'>Welcome Back!</h1>
              <p className='Sign-up7'>To stay connected with us, please log in using your personal information.</p>
              <button className="Sign-up-ghost" onClick={handleSignInClick}>Sign In</button>
            </div>
            <div className="Sign-up-overlay-panel overlay-right">
              <h1 className='Sign-up6'>Hello, and welcome!</h1>
              <p className='Sign-up7'>Please enter your personal details to begin your journey with us.</p>
              <button className="Sign-up-ghost" onClick={handleSignUpClick}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;


