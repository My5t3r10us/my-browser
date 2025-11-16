import { create } from 'zustand';
import electronAPI from '../utils/electronAPI';
import { generateId } from '../utils/id';

const useBrowserStore = create((set, get) => ({
  tabs: [],
  activeTabId: null,
  bookmarks: [],
  tabGroups: new Map(),
  
  // Tab management
  addTab: (url = 'home://newtab') => {
    const id = generateId();
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
    
    electronAPI.createTab({ id, url });
    electronAPI.switchTab(id);
    
    return id;
  },
  
  setActiveTab: (id) => {
    set({ activeTabId: id });
    electronAPI.switchTab(id);
  },
  
  closeTab: (id) => {
    const state = get();
    const tabIndex = state.tabs.findIndex(t => t.id === id);
    const newTabs = state.tabs.filter(t => t.id !== id);

    electronAPI.closeTab(id);

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
      electronAPI.switchTab(newActiveTab.id);
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
      electronAPI.navigate({ id: state.activeTabId, url });
      get().updateTab(state.activeTabId, { url, isLoading: true });
    }
  },
  
  goBack: () => {
    const state = get();
    if (state.activeTabId) {
      electronAPI.goBack(state.activeTabId);
    }
  },
  
  goForward: () => {
    const state = get();
    if (state.activeTabId) {
      electronAPI.goForward(state.activeTabId);
    }
  },
  
  reload: () => {
    const state = get();
    if (state.activeTabId) {
      electronAPI.reload(state.activeTabId);
      get().updateTab(state.activeTabId, { isLoading: true });
    }
  },
  
  // Bookmarks
  setBookmarks: (bookmarks) => set({ bookmarks }),
  
  addBookmark: async (title, url) => {
    const bookmarks = await electronAPI.addBookmark({ title, url });
    set({ bookmarks });
  },
  
  removeBookmark: async (id) => {
    const bookmarks = await electronAPI.removeBookmark(id);
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
    const groupId = generateId();
    const groups = await electronAPI.createGroup({
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
    const tab = state.tabs.find(t => t.id === tabId);

    if (!group || !tab) {
      return;
    }

    // Remove the tab from its previous group to prevent duplicates
    if (tab.groupId && tab.groupId !== groupId) {
      const previousGroup = state.tabGroups.get(tab.groupId);
      if (previousGroup) {
        const groups = await electronAPI.updateGroup({
          id: tab.groupId,
          updates: {
            ...previousGroup,
            tabs: previousGroup.tabs.filter(t => t !== tabId)
          }
        });
        set({ tabGroups: new Map(groups) });
      }
    }

    const refreshedState = get();
    const currentGroup = refreshedState.tabGroups.get(groupId) || group;
    const uniqueTabs = currentGroup.tabs.filter(t => t !== tabId).concat(tabId);

    const groups = await electronAPI.updateGroup({
      id: groupId,
      updates: {
        ...currentGroup,
        tabs: uniqueTabs
      }
    });
    set({ tabGroups: new Map(groups) });
    get().updateTab(tabId, { groupId });
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
        const groups = await electronAPI.updateGroup({
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
      const groups = await electronAPI.updateGroup({
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
    const groups = await electronAPI.deleteGroup(groupId);
    set({ tabGroups: new Map(groups) });
  }
}));

export default useBrowserStore;
