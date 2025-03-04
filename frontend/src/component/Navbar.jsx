import React, {useState} from 'react'
import Logo from "../assets/logoS.jpg"
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";


function Navbar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
  

  return (
    <>
    <nav className='navbar'>
             <div className="logo-container">
              <Link to='/'>
              <img src={Logo} alt="Logo" />
              </Link>
                
            </div>

        <div className="menu-icon" onClick={handleClick} >
            <i className={click ? 'fas fa-times' : 'fa-solid fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className='nav-item'>
           <Link to='/' className='nav-links' onClick={closeMobileMenu}>
           <span class="material-symbols-outlined">
              home 
            </span> Home
           </Link>
          </li>
          <li className='nav-item'>
           <Link to='/Resumes' className='nav-links' onClick={closeMobileMenu}>
           <span class="material-symbols-outlined">
            docs
          </span> Resumes
           </Link>
          </li>
          <li className='nav-item'>
           <Link to='/job' className='nav-links' onClick={closeMobileMenu}>
           <span class="material-symbols-outlined">
            work
            </span> Job offers
           </Link>
          </li>
          <li className='nav-item'>
          <Link to='/sign-up' className='nav-button' onClick={closeMobileMenu}>
    <span>Sign Up / Sign In</span>
    <span className="icon">
        <i className="fas fa-chevron-right"></i> 
    </span>
</Link>
          </li>
        </ul>
           
        
    </nav>  
</>
    
  );
};

export default Navbar;
