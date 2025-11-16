const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Tab management
  createTab: (data) => ipcRenderer.invoke('create-tab', data),
  switchTab: (id) => ipcRenderer.invoke('switch-tab', id),
  closeTab: (id) => ipcRenderer.invoke('close-tab', id),
  
  // Navigation
  navigate: (data) => ipcRenderer.invoke('navigate', data),
  goBack: (id) => ipcRenderer.invoke('go-back', id),
  goForward: (id) => ipcRenderer.invoke('go-forward', id),
  reload: (id) => ipcRenderer.invoke('reload', id),
  
  // Bookmarks
  addBookmark: (bookmark) => ipcRenderer.invoke('add-bookmark', bookmark),
  removeBookmark: (id) => ipcRenderer.invoke('remove-bookmark', id),
  getBookmarks: () => ipcRenderer.invoke('get-bookmarks'),
  
  // Tab groups
  createGroup: (group) => ipcRenderer.invoke('create-group', group),
  updateGroup: (data) => ipcRenderer.invoke('update-group', data),
  deleteGroup: (id) => ipcRenderer.invoke('delete-group', id),
  
  // Window controls
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  
  // Event listeners
  onNavigationUpdated: (callback) => {
    ipcRenderer.on('navigation-updated', (event, data) => callback(data));
  },
  onTitleUpdated: (callback) => {
    ipcRenderer.on('title-updated', (event, data) => callback(data));
  },
  onFaviconUpdated: (callback) => {
    ipcRenderer.on('favicon-updated', (event, data) => callback(data));
  },
  onBookmarksUpdated: (callback) => {
    ipcRenderer.on('bookmarks-updated', (event, data) => callback(data));
  },
  onGroupsUpdated: (callback) => {
    ipcRenderer.on('groups-updated', (event, data) => callback(data));
  },
  
  // Remove listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});
