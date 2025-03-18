import React from 'react';
import '../styles/ButtonBack.css'; // Import the CSS file

const ButtonBack = ({ onClick }) => {
  return (
    <button className="button-container" type="button"  onClick={onClick}>
      <div className="button-bg">
      <div className="button-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"/>
          <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"/>
        </svg>
        </div>
      </div>
      <p className="button-text">Go Back</p>
    </button>
  );
};

export default ButtonBack;
