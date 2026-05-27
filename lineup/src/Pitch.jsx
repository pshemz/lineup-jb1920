import React, { forwardRef } from 'react';
import './Pitch.css';

const Pitch = forwardRef(({ children }, ref) => {
  return (
    <div className="pitch-container" ref={ref}>
      <div className="pitch-field">
        {children}
      </div>
    </div>
  );
});

Pitch.displayName = 'Pitch';

export default Pitch;
