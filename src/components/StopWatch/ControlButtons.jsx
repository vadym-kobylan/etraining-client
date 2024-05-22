import React from 'react';
import './ControlButtons.css';

export default function ControlButtons(props) {
  const StartButton = (
    <div className="main-button" onClick={props.handleStart}>
      Start
    </div>
  );
  const ActiveButtons = (
    <div className="btn-grp">
      <div className="main-button" onClick={props.handlePauseResume}>
        {props.isPaused ? 'Resume' : 'Pause'}
      </div>
    </div>
  );

  return (
    <div className="Control-Buttons">
      <div>{props.active ? ActiveButtons : StartButton}</div>
    </div>
  );
}
