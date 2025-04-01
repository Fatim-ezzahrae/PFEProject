import React, {useState} from 'react'
import Logo from "../assets/logoS.jpg"
import { Link } from 'react-router-dom';
import "../styles/Navbar.css";
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

function Navbar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const { logout } = useLogout()
    const { user } = useAuthContext()

    const handleLogout = () => {
      logout()
    }
  

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
           <Link to='/Job' className='nav-links' onClick={closeMobileMenu}>
           <span class="material-symbols-outlined">
            work
            </span> Job offers
           </Link>
          </li>
          
          {/* Dashboard link - only shown to admins */}
          {user && user.role === 'admin' && (
            <li className='nav-item'>
              <Link to='/dashboard' className='nav-links' onClick={closeMobileMenu}>
                <span class="material-symbols-outlined">
                  dashboard
                </span> Dashboard
              </Link>
            </li>
          )}
          
          {!user && (
            <li className='nav-item'>
              <Link to='/sign-up' className='nav-button' onClick={closeMobileMenu}>
                  <span>Sign Up / Sign In</span>
                  <span className="icon">
                      <i className="fas fa-chevron-right"></i> 
                  </span>
              </Link>
            </li>
          )}
          {user && (
            <li className='nav-item'>
              <Link to='/sign-up' className='nav-button1' onClick={handleLogout}>
                <span>Logout</span><span class="material-symbols-outlined">
                  logout
                </span>
              </Link>
              <Link to='/Profile' className='prof-butt'>
              <span class="material-symbols-outlined">account_circle</span>              
              </Link>
            </li>
          )}
          
        </ul>
           
        
    </nav>  
</>
    
  );
};

export default Navbar;