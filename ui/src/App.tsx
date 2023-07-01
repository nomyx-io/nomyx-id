import React from 'react';

import NavBar from './components/NavBar.jsx';
import Home from './components/Home.jsx';


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './App.css';
import ClaimTopicsPage from './components/ClaimTopicsPage.jsx';
import TrustedIssuersPage from './components/TrustedIssuersPage.jsx';
import IdentitiesPage from './components/IdentitiesPage.jsx';
import ClaimsPage from './components/ClaimsPage.jsx';


function App() {
  return (
    <Router>
      {/* Navigation Menu */}
      <div className="topnav">
        <NavBar />
      </div>
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<ClaimTopicsPage />} />
          <Route path="/issuers" element={<TrustedIssuersPage />} />
          <Route path="/identities" element={<IdentitiesPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

