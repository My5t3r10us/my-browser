const { app, BrowserWindow, BrowserView, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

let mainWindow;
let views = new Map();
let currentViewId = null;
let bookmarks = [];
let tabGroups = new Map();

const userDataPath = app.getPath('userData');
const bookmarksPath = path.join(userDataPath, 'bookmarks.json');
const groupsPath = path.join(userDataPath, 'groups.json');

// Load saved data
function loadData() {
  try {
    if (fs.existsSync(bookmarksPath)) {
      bookmarks = JSON.parse(fs.readFileSync(bookmarksPath, 'utf8'));
    }
    if (fs.existsSync(groupsPath)) {
      const groupsData = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));
      tabGroups = new Map(groupsData);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

// Save bookmarks
function saveBookmarks() {
  fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2));
}

// Save tab groups
function saveGroups() {
  fs.writeFileSync(groupsPath, JSON.stringify(Array.from(tabGroups.entries()), null, 2));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  loadData();

  // Handle window resize once the window exists
  mainWindow.on('resize', () => {
    if (currentViewId && views.has(currentViewId)) {
      const view = views.get(currentViewId);
      view.setBounds(getContentBounds());
    }
  });

  // Send initial data to renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('bookmarks-updated', bookmarks);
    mainWindow.webContents.send('groups-updated', Array.from(tabGroups.entries()));
  });
}

function getContentBounds() {
  const bounds = mainWindow.getBounds();
  return {
    x: 0,
    y: 140, // Space for tabs and navigation
    width: bounds.width,
    height: bounds.height - 140
  };
}

function createBrowserView(id, url = 'about:blank') {
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.addBrowserView(view);
  
  // Set bounds leaving space for the UI
  view.setBounds(getContentBounds());

  view.setAutoResize({ width: true, height: true });
  
  if (url && url !== 'about:blank' && url !== 'home://newtab') {
    view.webContents.loadURL(url);
  }

  // Track navigation events
  view.webContents.on('did-navigate', (event, url) => {
    mainWindow.webContents.send('navigation-updated', {
      id,
      url,
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
  });

  view.webContents.on('did-navigate-in-page', (event, url) => {
    mainWindow.webContents.send('navigation-updated', {
      id,
      url,
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward()
    });
  });

  view.webContents.on('page-title-updated', (event, title) => {
    mainWindow.webContents.send('title-updated', { id, title });
  });

  view.webContents.on('page-favicon-updated', (event, favicons) => {
    mainWindow.webContents.send('favicon-updated', { id, favicon: favicons[0] });
  });

  views.set(id, view);
  return view;
}

// IPC Handlers
ipcMain.handle('create-tab', (event, { id, url }) => {
  const view = createBrowserView(id, url);
  return { id, url };
});

ipcMain.handle('switch-tab', (event, id) => {
  if (currentViewId && views.has(currentViewId)) {
    const currentView = views.get(currentViewId);
    currentView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
  }

  if (views.has(id)) {
    const view = views.get(id);
    view.setBounds(getContentBounds());
    currentViewId = id;
    return true;
  }
  return false;
});

ipcMain.handle('close-tab', (event, id) => {
  if (views.has(id)) {
    const view = views.get(id);
    mainWindow.removeBrowserView(view);
    views.delete(id);
    
    if (currentViewId === id) {
      currentViewId = null;
    }
    return true;
  }
  return false;
});

ipcMain.handle('navigate', (event, { id, url }) => {
  if (views.has(id)) {
    const view = views.get(id);

    // Handle internal pages
    if (url === 'home://newtab') {
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      if (currentViewId === id) {
        currentViewId = null;
      }
      return;
    }

    // Ensure the view is visible when leaving the home page
    const bounds = view.getBounds();
    if (bounds.width === 0 || bounds.height === 0) {
      view.setBounds(getContentBounds());
      currentViewId = id;
    }

    // Ensure proper URL format
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    view.webContents.loadURL(url);
  }
});

ipcMain.handle('go-back', (event, id) => {
  if (views.has(id)) {
    const view = views.get(id);
    if (view.webContents.canGoBack()) {
      view.webContents.goBack();
    }
  }
});

ipcMain.handle('go-forward', (event, id) => {
  if (views.has(id)) {
    const view = views.get(id);
    if (view.webContents.canGoForward()) {
      view.webContents.goForward();
    }
  }
});

ipcMain.handle('reload', (event, id) => {
  if (views.has(id)) {
    const view = views.get(id);
    view.webContents.reload();
  }
});

ipcMain.handle('add-bookmark', (event, bookmark) => {
  bookmarks.push({ ...bookmark, id: randomUUID() });
  saveBookmarks();
  mainWindow.webContents.send('bookmarks-updated', bookmarks);
  return bookmarks;
});

ipcMain.handle('remove-bookmark', (event, id) => {
  bookmarks = bookmarks.filter(b => b.id !== id);
  saveBookmarks();
  mainWindow.webContents.send('bookmarks-updated', bookmarks);
  return bookmarks;
});

ipcMain.handle('get-bookmarks', () => {
  return bookmarks;
});

ipcMain.handle('create-group', (event, group) => {
  tabGroups.set(group.id, group);
  saveGroups();
  mainWindow.webContents.send('groups-updated', Array.from(tabGroups.entries()));
  return Array.from(tabGroups.entries());
});

ipcMain.handle('update-group', (event, { id, updates }) => {
  if (tabGroups.has(id)) {
    const group = tabGroups.get(id);
    tabGroups.set(id, { ...group, ...updates });
    saveGroups();
    mainWindow.webContents.send('groups-updated', Array.from(tabGroups.entries()));
  }
  return Array.from(tabGroups.entries());
});

ipcMain.handle('delete-group', (event, id) => {
  tabGroups.delete(id);
  saveGroups();
  mainWindow.webContents.send('groups-updated', Array.from(tabGroups.entries()));
  return Array.from(tabGroups.entries());
});

ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.handle('close-window', () => {
  mainWindow.close();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
