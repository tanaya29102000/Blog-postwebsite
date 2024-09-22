import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="left-side">MyMessages</div>
      
      {/* Empty div to create space between left and right */}
      <div className="navbar-space"></div>
      
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/home" className="navbar-link">Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/CreatePost" className="navbar-link">Create Post</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
