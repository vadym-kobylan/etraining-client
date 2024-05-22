import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="main-container">
      <h1 className="p-10">E-Training</h1>
      <h2>Page Not Found</h2>
      <Link className="main-button" to="/">
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;
