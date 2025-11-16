import React from 'react';
import electronAPI from '../utils/electronAPI';

const TitleBar = () => {
  const handleMinimize = () => {
    electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    electronAPI.closeWindow();
  };

  return (
    <div className="title-bar">
      <div className="title-text">Browser</div>
      <div className="window-controls">
        <button 
          className="window-control minimize" 
          onClick={handleMinimize}
          aria-label="Minimize"
        />
        <button 
          className="window-control maximize" 
          onClick={handleMaximize}
          aria-label="Maximize"
        />
        <button 
          className="window-control close" 
          onClick={handleClose}
          aria-label="Close"
        />
      </div>
    </div>
  );
};

export default TitleBar;
