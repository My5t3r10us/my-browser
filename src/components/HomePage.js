import React, { useState } from 'react';
import { Globe, Search, Youtube, Github, Twitter, Mail, ShoppingBag, BookOpen } from 'lucide-react';
import useBrowserStore from '../store/browserStore';

const HomePage = () => {
  const { navigateTo, addTab, activeTabId } = useBrowserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const hasActiveTab = Boolean(activeTabId);
  
  const quickLinks = [
    { title: 'Google', url: 'https://www.google.com', icon: <Search size={24} /> },
    { title: 'YouTube', url: 'https://www.youtube.com', icon: <Youtube size={24} /> },
    { title: 'GitHub', url: 'https://www.github.com', icon: <Github size={24} /> },
    { title: 'Twitter', url: 'https://www.twitter.com', icon: <Twitter size={24} /> },
    { title: 'Gmail', url: 'https://mail.google.com', icon: <Mail size={24} /> },
    { title: 'Amazon', url: 'https://www.amazon.com', icon: <ShoppingBag size={24} /> },
    { title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: <BookOpen size={24} /> },
    { title: 'Reddit', url: 'https://www.reddit.com', icon: <Globe size={24} /> }
  ];
  
  const handleSearch = () => {
    if (!hasActiveTab) return;

    if (searchQuery.trim()) {
      const query = encodeURIComponent(searchQuery);
      navigateTo(`https://www.google.com/search?q=${query}`);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="home-page">
      <div className="home-logo">
        <Globe size={64} />
      </div>
      
      <div className="home-search">
        <input
          type="text"
          className="home-search-input"
          placeholder={hasActiveTab ? 'Search the web...' : 'Create a tab to start browsing'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          disabled={!hasActiveTab}
        />
      </div>

      <div className="quick-links">
        {quickLinks.map(link => (
          <button
            key={link.url}
            className="quick-link"
            onClick={() => hasActiveTab && navigateTo(link.url)}
            type="button"
            disabled={!hasActiveTab}
          >
            <div className="quick-link-icon">
              {link.icon}
            </div>
            <span className="quick-link-title">{link.title}</span>
          </button>
        ))}
      </div>

      {!hasActiveTab && (
        <div className="home-empty-state">
          <p>No active tab is available. Create one to start browsing.</p>
          <button className="quick-link" type="button" onClick={() => addTab()}>
            Open a new tab
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
