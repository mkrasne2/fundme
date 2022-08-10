import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Nav.css';
import { Link } from  "react-router-dom";

export default function Header() {
  
  return (
    <div className="topnav">
  <div className="topnav-left">
    <Link className="passive" to="/">Fundme</Link>
  </div>
  <div className="topnav-right">
    <Link to="/proposals">Current Proposals</Link>
    <Link to="/submit">Create a Funding Proposal</Link>
    <Link to="/about">About</Link>
  </div>
  
</div>
      )
      }