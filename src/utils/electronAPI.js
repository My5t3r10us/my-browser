const noop = () => {};
const asyncNoop = async () => undefined;
const asyncArray = async () => [];
const listenersNoop = () => {};

const mockElectronAPI = {
  // Tab management
  createTab: asyncNoop,
  switchTab: noop,
  closeTab: noop,

  // Navigation
  navigate: noop,
  goBack: noop,
  goForward: noop,
  reload: noop,

  // Bookmarks
  addBookmark: asyncArray,
  removeBookmark: asyncArray,
  getBookmarks: asyncArray,

  // Tab groups
  createGroup: asyncArray,
  updateGroup: asyncArray,
  deleteGroup: asyncArray,

  // Window controls
  minimizeWindow: noop,
  maximizeWindow: noop,
  closeWindow: noop,

  // Event listeners
  onNavigationUpdated: listenersNoop,
  onTitleUpdated: listenersNoop,
  onFaviconUpdated: listenersNoop,
  onBookmarksUpdated: listenersNoop,
  onGroupsUpdated: listenersNoop,

  removeAllListeners: listenersNoop
};

let cachedApi = null;

export const getElectronAPI = () => {
  if (cachedApi) {
    return cachedApi;
  }

  if (typeof window !== 'undefined' && window.electronAPI) {
    cachedApi = window.electronAPI;
  } else {
    cachedApi = mockElectronAPI;
    if (typeof window !== 'undefined' && !window.__electronApiWarningShown) {
      window.__electronApiWarningShown = true;
      console.warn('Electron API not detected. Falling back to mock implementation.');
    }
  }

  return cachedApi;
};

export default getElectronAPI();
