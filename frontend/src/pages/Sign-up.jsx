import React, { useState } from 'react';
import '../styles/Signup.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const Signup = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);

  const handleSignUpClick = () => setIsSignUp(true);
  const handleSignInClick = () => setIsSignUp(false);

  return (
    <>
      <div className={`Sign-container ${isSignUp ? 'right-panel-active' : ''}`}>
        <div className="form-container sign-up-container">
          <form className='Sign-up1'>
            <h1 className='Sign-up8'>Sign Up</h1>
            <div className='Sign-up-input-container'> <div className='Sign-up-icon'>
              <span class="material-symbols-outlined"> person</span>
              </div>
            <input className="Sign-up3"type="name" placeholder="Name" />
            </div>
            <div className="Sign-up-input-container"> <div className='Sign-up-icon'>
            <span class="material-symbols-outlined">mail</span>
            </div>
            <input className="Sign-up3"type="email" placeholder="Email" />
            </div>
            

          <div className="Sign-up-input-container">
          <div className='Sign-up-icon'>
           <span className="material-symbols-outlined">lock</span>
           </div>
           <input className="Sign-up3" type={showPasswordSignUp ? "text" : "password"} placeholder="Password" />
           <button 
           type="button" 
           className="toggle-password" 
            onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
            >
             <FontAwesomeIcon icon={showPasswordSignUp ? faEye : faEyeSlash} />
           </button>
          </div>
            <button className='Sign-up' type="submit">Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form className='Sign-up1'>
            <h1 className='Sign-up8'>Sign In</h1>
            <div className="Sign-up-input-container">
            <div className='Sign-up-icon'>
            <span class="material-symbols-outlined">mail</span>
            </div>
              <input className='Sign-up3' type="email" placeholder="Email" />
            </div>


            <div className="Sign-up-input-container">
            <div className='Sign-up-icon'>
             <span className="material-symbols-outlined">lock</span>
             </div>
               <input className="Sign-up3" type={showPasswordSignIn ? "text" : "password"} placeholder="Password" />
             <button 
               type="button" 
                className="toggle-password" 
                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
             >
                <FontAwesomeIcon icon={showPasswordSignIn ? faEye : faEyeSlash} />
              </button>
            </div>


            <a className='Sign-up5' href="#">Forgot your password?</a>
            <button className='Sign-up' type="submit">Sign In</button>
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
