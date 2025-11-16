import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import useBrowserStore from '../store/browserStore';
import TabGroupMenu from './TabGroupMenu';

const TabBar = () => {
  const { 
    tabs, 
    activeTabId, 
    tabGroups,
    addTab, 
    setActiveTab, 
    closeTab,
    toggleGroupCollapse 
  } = useBrowserStore();
  
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [draggedTab, setDraggedTab] = useState(null);
  const [dragOverGroup, setDragOverGroup] = useState(null);

  const handleDragStart = (e, tabId) => {
    setDraggedTab(tabId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, groupId) => {
    e.preventDefault();
    setDragOverGroup(groupId);
  };

  const handleDragLeave = () => {
    setDragOverGroup(null);
  };

  const handleDrop = async (e, groupId) => {
    e.preventDefault();
    if (draggedTab && groupId) {
      const store = useBrowserStore.getState();
      await store.addTabToGroup(draggedTab, groupId);
    }
    setDraggedTab(null);
    setDragOverGroup(null);
  };

  const renderTab = (tab) => {
    const favicon = tab.favicon || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNiIgZmlsbD0iI2RkZCIvPjwvc3ZnPg==';
    
    return (
      <div
        key={tab.id}
        className={`tab ${activeTabId === tab.id ? 'active' : ''}`}
        onClick={() => setActiveTab(tab.id)}
        draggable
        onDragStart={(e) => handleDragStart(e, tab.id)}
      >
        {tab.isLoading ? (
          <div className="loading-spinner" />
        ) : (
          <img src={favicon} alt="" className="tab-favicon" />
        )}
        <span className="tab-title">{tab.title}</span>
        <div 
          className="tab-close"
          onClick={(e) => {
            e.stopPropagation();
            closeTab(tab.id);
          }}
        >
          <X size={12} />
        </div>
      </div>
    );
  };

  const renderGroup = (group) => {
    const groupTabs = tabs.filter(tab => tab.groupId === group.id);
    
    if (group.isCollapsed) {
      return (
        <div
          key={group.id}
          className="tab-group collapsed"
          style={{ backgroundColor: group.color + '20' }}
          onClick={() => toggleGroupCollapse(group.id)}
        >
          <div 
            className="tab-group-header"
            style={{ backgroundColor: group.color }}
          >
            <ChevronRight size={14} />
            <span>{group.name}</span>
            <span>({groupTabs.length})</span>
          </div>
        </div>
      );
    }

    return (
      <div
        key={group.id}
        className={`tab-group ${dragOverGroup === group.id ? 'drag-over' : ''}`}
        style={{ backgroundColor: group.color + '10' }}
        onDragOver={handleDragOver}
        onDragEnter={(e) => handleDragEnter(e, group.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, group.id)}
      >
        <div 
          className="tab-group-header"
          style={{ backgroundColor: group.color }}
          onClick={() => toggleGroupCollapse(group.id)}
        >
          <ChevronDown size={14} />
          <span>{group.name}</span>
        </div>
        {groupTabs.map(renderTab)}
      </div>
    );
  };

  // Organize tabs by groups
  const ungroupedTabs = tabs.filter(tab => !tab.groupId);
  const groups = Array.from(tabGroups.values());

  return (
    <div className="tab-bar">
      {/* Render groups first */}
      {groups.map(renderGroup)}
      
      {/* Render ungrouped tabs */}
      {ungroupedTabs.map(renderTab)}
      
      <button 
        className="new-tab-button" 
        onClick={() => addTab()}
        title="New Tab"
      >
        <Plus size={16} />
      </button>
      
      <button 
        className="new-tab-button" 
        onClick={() => setShowGroupMenu(!showGroupMenu)}
        title="Tab Groups"
        style={{ position: 'relative' }}
      >
        <Layers size={16} />
        {showGroupMenu && <TabGroupMenu onClose={() => setShowGroupMenu(false)} />}
      </button>
    </div>
  );
};

export default TabBar;
