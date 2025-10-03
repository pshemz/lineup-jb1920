import React from 'react';
import './Pitch.css';

const Pitch = ({ children }) => {
  return (
    <div className="pitch-container">
      <div className="pitch-field">
        {children}
      </div>
    </div>
  );
};

export default Pitch;