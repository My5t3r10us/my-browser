import React, { useEffect } from 'react';
import './App.css';
import TitleBar from './components/TitleBar';
import TabBar from './components/TabBar';
import NavigationBar from './components/NavigationBar';
import BookmarksBar from './components/BookmarksBar';
import HomePage from './components/HomePage';
import useBrowserStore from './store/browserStore';

function App() {
  const { 
    tabs, 
    activeTabId, 
    addTab, 
    updateTab, 
    setBookmarks, 
    setTabGroups 
  } = useBrowserStore();

  useEffect(() => {
    // Load initial bookmarks
    window.electronAPI.getBookmarks().then(setBookmarks);
    
    // Set up event listeners
    window.electronAPI.onNavigationUpdated((data) => {
      updateTab(data.id, {
        url: data.url,
        canGoBack: data.canGoBack,
        canGoForward: data.canGoForward,
        isLoading: false
      });
    });
    
    window.electronAPI.onTitleUpdated((data) => {
      updateTab(data.id, { title: data.title });
    });
    
    window.electronAPI.onFaviconUpdated((data) => {
      updateTab(data.id, { favicon: data.favicon });
    });
    
    window.electronAPI.onBookmarksUpdated((bookmarks) => {
      setBookmarks(bookmarks);
    });
    
    window.electronAPI.onGroupsUpdated((groups) => {
      setTabGroups(groups);
    });
    
    // Create initial tab if none exist
    if (tabs.length === 0) {
      addTab();
    }
    
    // Cleanup
    return () => {
      window.electronAPI.removeAllListeners('navigation-updated');
      window.electronAPI.removeAllListeners('title-updated');
      window.electronAPI.removeAllListeners('favicon-updated');
      window.electronAPI.removeAllListeners('bookmarks-updated');
      window.electronAPI.removeAllListeners('groups-updated');
    };
  }, []);

  const activeTab = tabs.find(t => t.id === activeTabId);
  const showHomePage = !activeTabId || (activeTab && activeTab.url === 'home://newtab');

  return (
    <div className="app">
      <TitleBar />
      <TabBar />
      <NavigationBar />
      <BookmarksBar />
      {showHomePage && <HomePage />}
    </div>
  );
}

export default App;
