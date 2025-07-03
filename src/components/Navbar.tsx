import React from 'react';
import './Navbar.css';
import scrollaLogo from '../Images/Scrolla.png'; 

interface NavbarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, onSearch }) => {
  return (
    <div className="navbar">
      <h1>Scrolla </h1>
      <img src={scrollaLogo} alt="Scrolla Logo" className="logo-img" />
      <input
        type="text"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default Navbar;
