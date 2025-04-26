import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Signup.css';  
import '../styles/toastNotif.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useSignup } from "../hooks/useSignup";
import { useLogin } from "../hooks/useLogin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, errorSignup, isLoadingSignup } = useSignup();
  const { login, errorLogin, isLoadingLogin } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPasswordSignUp, setShowPasswordSignUp] = useState(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false);
  
  const handlePostAuthRedirect = () => {
    if (location.state?.fromTemplate) {
      navigate("/resumes", { 
        state: { 
          fromTemplate: true,
          templateId: location.state.templateId 
        },
        replace: true
      });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await signup(email, password);
      if (userData) {
        toast.success('Signup successful!');
        handlePostAuthRedirect();
      }
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    }
  };
  
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(email, password);
      if (userData) {
        toast.success('Login successful!');
        handlePostAuthRedirect();
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
    }
  };

  const handleSignUpClick = () => {
    setIsSignUp(true);  
  };

  const handleSignInClick = () => {
    setIsSignUp(false);  
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`Sign-container ${isSignUp ? 'right-panel-active' : ''}`}>
      
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form className='Sign-up1' onSubmit={handleSignUpSubmit}>
            <h1 className='Sign-up8'>Sign Up</h1>
            
            <div className="Sign-up-input-container">
              <div className='Sign-up-icon'>
                <span className="material-symbols-outlined">mail</span>
              </div>
              <input 
                className="Sign-up3" 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
                aria-label={showPasswordSignUp ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPasswordSignUp ? faEye : faEyeSlash} />
              </button>
            </div>
            <button className='Sign-up' type="submit" disabled={isLoadingSignup}>
              {isLoadingSignup ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            {/* Mobile toggle button for sign-up form */}
            <div className="mobile-form-toggle">
              <p>Already have an account? <button type="button" onClick={handleSignInClick}>Sign In</button></p>
            </div>
          </form>
        </div>
        
        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form className='Sign-up1' onSubmit={handleSignInSubmit}>
            <h1 className='Sign-up8'>Sign In</h1>
            <div className="Sign-up-input-container">
              <div className='Sign-up-icon'>
                <span className="material-symbols-outlined">mail</span>
              </div>
              <input 
                className="Sign-up3" 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="Sign-up-input-container">
              <div className='Sign-up-icon'>
                <span className="material-symbols-outlined">lock</span>
              </div>
              <input 
                className="Sign-up3" 
                type={showPasswordSignIn ? "text" : "password"} 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="toggle-password" 
                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
                aria-label={showPasswordSignIn ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={showPasswordSignIn ? faEye : faEyeSlash} />
              </button>
            </div>

            <a className='Sign-up5' href="#">Forgot your password?</a>
            <button className='Sign-up' type="submit" disabled={isLoadingLogin}>
              {isLoadingLogin ? 'Signing In...' : 'Sign In'}
            </button>
            
            {/* Mobile toggle button for sign-in form */}
            <div className="mobile-form-toggle">
              <p>Don't have an account? <button type="button" onClick={handleSignUpClick}>Sign Up</button></p>
            </div>
          </form>
        </div>
        
        {/* Overlay (hidden on mobile) */}
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