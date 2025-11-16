import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, StarOff } from 'lucide-react';
import useBrowserStore from '../store/browserStore';

const NavigationBar = () => {
  const { 
    tabs, 
    activeTabId, 
    goBack, 
    goForward, 
    reload, 
    navigateTo,
    addBookmark,
    removeBookmark,
    bookmarks,
    isBookmarked
  } = useBrowserStore();
  
  const [urlValue, setUrlValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  useEffect(() => {
    if (!isEditing && activeTab) {
      setUrlValue(activeTab.url === 'home://newtab' ? '' : activeTab.url);
    }
  }, [activeTab, isEditing]);
  
  const handleNavigate = () => {
    if (urlValue.trim()) {
      navigateTo(urlValue);
      setIsEditing(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };
  
  const toggleBookmark = async () => {
    if (!activeTab || activeTab.url === 'home://newtab') return;
    
    const bookmarkForUrl = bookmarks.find(b => b.url === activeTab.url);
    
    if (bookmarkForUrl) {
      await removeBookmark(bookmarkForUrl.id);
    } else {
      await addBookmark(activeTab.title, activeTab.url);
    }
  };
  
  const isCurrentPageBookmarked = activeTab && isBookmarked(activeTab.url);
  
  return (
    <div className="navigation-bar">
      <button 
        className="nav-button" 
        onClick={goBack}
        disabled={!activeTab?.canGoBack}
        title="Back"
      >
        <ArrowLeft size={18} />
      </button>
      
      <button 
        className="nav-button" 
        onClick={goForward}
        disabled={!activeTab?.canGoForward}
        title="Forward"
      >
        <ArrowRight size={18} />
      </button>
      
      <button 
        className="nav-button" 
        onClick={reload}
        disabled={!activeTab || activeTab.url === 'home://newtab'}
        title="Reload"
      >
        <RotateCw size={18} />
      </button>
      
      <button 
        className="nav-button" 
        onClick={() => navigateTo('home://newtab')}
        title="Home"
      >
        <Home size={18} />
      </button>
      
      <input
        type="text"
        className="url-bar"
        value={urlValue}
        onChange={(e) => setUrlValue(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        placeholder="Search or enter web address"
      />
      
      <button 
        className="nav-button" 
        onClick={toggleBookmark}
        disabled={!activeTab || activeTab.url === 'home://newtab'}
        title={isCurrentPageBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        {isCurrentPageBookmarked ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
      </button>
    </div>
  );
};

export default NavigationBar;
