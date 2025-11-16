import { create } from 'zustand';

const useBrowserStore = create((set, get) => ({
  tabs: [],
  activeTabId: null,
  bookmarks: [],
  tabGroups: new Map(),
  
  // Tab management
  addTab: (url = 'home://newtab') => {
    const id = Date.now().toString();
    const newTab = {
      id,
      url,
      title: 'New Tab',
      favicon: null,
      canGoBack: false,
      canGoForward: false,
      groupId: null,
      isLoading: false
    };
    
    set(state => ({
      tabs: [...state.tabs, newTab],
      activeTabId: id
    }));
    
    window.electronAPI.createTab({ id, url });
    window.electronAPI.switchTab(id);
    
    return id;
  },
  
  setActiveTab: (id) => {
    set({ activeTabId: id });
    window.electronAPI.switchTab(id);
  },
  
  closeTab: (id) => {
    const state = get();
    const tabIndex = state.tabs.findIndex(t => t.id === id);
    const newTabs = state.tabs.filter(t => t.id !== id);

    window.electronAPI.closeTab(id);

    if (newTabs.length === 0) {
      set({
        tabs: [],
        activeTabId: null
      });

      // Automatically recreate a home tab to keep the UI in a usable state
      setTimeout(() => {
        const currentState = get();
        if (currentState.tabs.length === 0) {
          currentState.addTab();
        }
      }, 0);
      return;
    }

    if (state.activeTabId === id) {
      const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
      set({
        tabs: newTabs,
        activeTabId: newActiveTab.id
      });
      window.electronAPI.switchTab(newActiveTab.id);
    } else {
      set({ tabs: newTabs });
    }
  },
  
  updateTab: (id, updates) => {
    set(state => ({
      tabs: state.tabs.map(tab =>
        tab.id === id ? { ...tab, ...updates } : tab
      )
    }));
  },
  
  navigateTo: (url) => {
    const state = get();
    if (state.activeTabId) {
      window.electronAPI.navigate({ id: state.activeTabId, url });
      get().updateTab(state.activeTabId, { url, isLoading: true });
    }
  },
  
  goBack: () => {
    const state = get();
    if (state.activeTabId) {
      window.electronAPI.goBack(state.activeTabId);
    }
  },
  
  goForward: () => {
    const state = get();
    if (state.activeTabId) {
      window.electronAPI.goForward(state.activeTabId);
    }
  },
  
  reload: () => {
    const state = get();
    if (state.activeTabId) {
      window.electronAPI.reload(state.activeTabId);
      get().updateTab(state.activeTabId, { isLoading: true });
    }
  },
  
  // Bookmarks
  setBookmarks: (bookmarks) => set({ bookmarks }),
  
  addBookmark: async (title, url) => {
    const bookmarks = await window.electronAPI.addBookmark({ title, url });
    set({ bookmarks });
  },
  
  removeBookmark: async (id) => {
    const bookmarks = await window.electronAPI.removeBookmark(id);
    set({ bookmarks });
  },
  
  isBookmarked: (url) => {
    const state = get();
    return state.bookmarks.some(b => b.url === url);
  },
  
  // Tab Groups
  setTabGroups: (groups) => {
    set({ tabGroups: new Map(groups) });
  },
  
  createGroup: async (name, color) => {
    const groupId = Date.now().toString();
    const groups = await window.electronAPI.createGroup({
      id: groupId,
      name,
      color,
      isCollapsed: false,
      tabs: []
    });
    set({ tabGroups: new Map(groups) });
    return groupId;
  },
  
  addTabToGroup: async (tabId, groupId) => {
    const state = get();
    const group = state.tabGroups.get(groupId);
    if (group) {
      const updatedGroup = {
        ...group,
        tabs: [...group.tabs, tabId]
      };
      const groups = await window.electronAPI.updateGroup({
        id: groupId,
        updates: updatedGroup
      });
      set({ tabGroups: new Map(groups) });
      get().updateTab(tabId, { groupId });
    }
  },
  
  removeTabFromGroup: async (tabId) => {
    const state = get();
    const tab = state.tabs.find(t => t.id === tabId);
    if (tab && tab.groupId) {
      const group = state.tabGroups.get(tab.groupId);
      if (group) {
        const updatedGroup = {
          ...group,
          tabs: group.tabs.filter(t => t !== tabId)
        };
        const groups = await window.electronAPI.updateGroup({
          id: tab.groupId,
          updates: updatedGroup
        });
        set({ tabGroups: new Map(groups) });
        get().updateTab(tabId, { groupId: null });
      }
    }
  },
  
  toggleGroupCollapse: async (groupId) => {
    const state = get();
    const group = state.tabGroups.get(groupId);
    if (group) {
      const groups = await window.electronAPI.updateGroup({
        id: groupId,
        updates: { isCollapsed: !group.isCollapsed }
      });
      set({ tabGroups: new Map(groups) });
    }
  },
  
  deleteGroup: async (groupId) => {
    const state = get();
    // Remove group from all tabs
    state.tabs.forEach(tab => {
      if (tab.groupId === groupId) {
        get().updateTab(tab.id, { groupId: null });
      }
    });
    const groups = await window.electronAPI.deleteGroup(groupId);
    set({ tabGroups: new Map(groups) });
  }
}));

export default useBrowserStore;
