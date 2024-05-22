import React from 'react';
import './Timer.css';

export default function Timer(props) {
  return (
    <div className={`timer ${props.className}`}>
      <span className="digits">{('0' + Math.floor((props.time / 3600) % 24)).slice(-2)}:</span>
      <span className="digits">{('0' + Math.floor((props.time / 60) % 60)).slice(-2)}:</span>
      <span className="digits mili-sec">{('0' + Math.floor((props.time / 1) % 60)).slice(-2)}</span>
    </div>
  );
}
