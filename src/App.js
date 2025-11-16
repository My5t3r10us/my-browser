import React, { useEffect } from 'react';
import './App.css';
import TitleBar from './components/TitleBar';
import TabBar from './components/TabBar';
import NavigationBar from './components/NavigationBar';
import BookmarksBar from './components/BookmarksBar';
import HomePage from './components/HomePage';
import useBrowserStore from './store/browserStore';
import electronAPI from './utils/electronAPI';

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
    electronAPI.getBookmarks().then(setBookmarks);
    
    // Set up event listeners
    electronAPI.onNavigationUpdated((data) => {
      updateTab(data.id, {
        url: data.url,
        canGoBack: data.canGoBack,
        canGoForward: data.canGoForward,
        isLoading: false
      });
    });
    
    electronAPI.onTitleUpdated((data) => {
      updateTab(data.id, { title: data.title });
    });
    
    electronAPI.onFaviconUpdated((data) => {
      updateTab(data.id, { favicon: data.favicon });
    });
    
    electronAPI.onBookmarksUpdated((bookmarks) => {
      setBookmarks(bookmarks);
    });
    
    electronAPI.onGroupsUpdated((groups) => {
      setTabGroups(groups);
    });
    
    // Create initial tab if none exist
    if (tabs.length === 0) {
      addTab();
    }
    
    // Cleanup
    return () => {
      electronAPI.removeAllListeners('navigation-updated');
      electronAPI.removeAllListeners('title-updated');
      electronAPI.removeAllListeners('favicon-updated');
      electronAPI.removeAllListeners('bookmarks-updated');
      electronAPI.removeAllListeners('groups-updated');
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
