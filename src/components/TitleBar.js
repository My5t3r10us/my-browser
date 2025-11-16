import React from 'react';

const TitleBar = () => {
  const handleMinimize = () => {
    window.electronAPI.minimizeWindow();
  };

  const handleMaximize = () => {
    window.electronAPI.maximizeWindow();
  };

  const handleClose = () => {
    window.electronAPI.closeWindow();
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
