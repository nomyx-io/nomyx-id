
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li>
        <li><Link to="/topics">Claim Topics</Link></li>
        <ul>
          <li><Link to="/topics/add">Add new...</Link></li>
          <li><Link to="/topics">List</Link></li>
        </ul>
      </li>
      <li>
        <Link to="/issuers">Trusted Issuers</Link>
        <ul>
          <li><Link to="/issuers/add">Add new...</Link></li>
          <li><Link to="/issuers/list">List</Link></li>
        </ul>
      </li>
      <li>
        <Link to="/identities">Identities</Link>
        <ul>
          <li><Link to="/identities/add">Add new...</Link></li>
          <li><Link to="/identities/list">List</Link></li>
        </ul>
      </li>
      <li>
        <li><Link to="/claims">Claims</Link></li>
        <ul>
          <li><Link to="/claims/add">Add new...</Link></li>
          <li><Link to="/claims">List</Link></li>
        </ul>
      </li>
    </ul>
  </nav>
);

export default NavBar;
