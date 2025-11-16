# Documentation Electron

## 📦 Processus principal (main.js)

Le fichier `electron/main.js` est le cœur de l'application Electron. Il gère la fenêtre principale, les BrowserViews et toutes les communications IPC.

## 🏁 Initialisation

### Création de la fenêtre principale

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    frame: false,              // Pas de barre de titre native
    titleBarStyle: 'hidden',   // Barre de titre cachée
    webPreferences: {
      nodeIntegration: false,  // Sécurité : pas de Node.js dans le renderer
      contextIsolation: true,  // Isolation du contexte
      preload: path.join(__dirname, 'preload.js')
    }
  });
}
```

### Chargement de l'interface

**Mode développement** :
```javascript
mainWindow.loadURL('http://localhost:3000');
```

**Mode production** :
```javascript
mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
```

## 🌐 Gestion des BrowserViews

### Structure de données

```javascript
let views = new Map();        // Map<id, BrowserView>
let currentViewId = null;     // ID de la vue active
```

### Création d'une BrowserView

```javascript
function createBrowserView(id, url = 'about:blank') {
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.addBrowserView(view);
  
  // Positionnement (140px pour l'UI)
  view.setBounds({ 
    x: 0, 
    y: 140, 
    width: bounds.width, 
    height: bounds.height - 140 
  });

  // Auto-redimensionnement
  view.setAutoResize({ width: true, height: true });
  
  // Chargement de l'URL
  if (url && url !== 'about:blank' && url !== 'home://newtab') {
    view.webContents.loadURL(url);
  }

  views.set(id, view);
  return view;
}
```

### Événements de navigation

Chaque BrowserView écoute les événements de navigation :

#### `did-navigate`
Déclenché lors d'un changement de page
```javascript
view.webContents.on('did-navigate', (event, url) => {
  mainWindow.webContents.send('navigation-updated', {
    id,
    url,
    canGoBack: view.webContents.canGoBack(),
    canGoForward: view.webContents.canGoForward()
  });
});
```

#### `did-navigate-in-page`
Déclenché lors d'une navigation dans la page (ancres, History API)
```javascript
view.webContents.on('did-navigate-in-page', (event, url) => {
  // Même traitement que did-navigate
});
```

#### `page-title-updated`
Déclenché quand le titre de la page change
```javascript
view.webContents.on('page-title-updated', (event, title) => {
  mainWindow.webContents.send('title-updated', { id, title });
});
```

#### `page-favicon-updated`
Déclenché quand le favicon est chargé
```javascript
view.webContents.on('page-favicon-updated', (event, favicons) => {
  mainWindow.webContents.send('favicon-updated', { id, favicon: favicons[0] });
});
```

## 🔄 Handlers IPC

### Gestion des onglets

#### `create-tab`
Crée un nouvel onglet avec une URL
```javascript
ipcMain.handle('create-tab', (event, { id, url }) => {
  const view = createBrowserView(id, url);
  return { id, url };
});
```

#### `switch-tab`
Change l'onglet actif
```javascript
ipcMain.handle('switch-tab', (event, id) => {
  // Masquer la vue actuelle
  if (currentViewId && views.has(currentViewId)) {
    const currentView = views.get(currentViewId);
    currentView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
  }

  // Afficher la nouvelle vue
  if (views.has(id)) {
    const view = views.get(id);
    const bounds = mainWindow.getBounds();
    view.setBounds({ 
      x: 0, 
      y: 140, 
      width: bounds.width, 
      height: bounds.height - 140 
    });
    currentViewId = id;
    return true;
  }
  return false;
});
```

#### `close-tab`
Ferme un onglet et supprime sa BrowserView
```javascript
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
```

### Navigation

#### `navigate`
Navigue vers une URL
```javascript
ipcMain.handle('navigate', (event, { id, url }) => {
  if (views.has(id)) {
    const view = views.get(id);
    
    // Gestion des pages internes
    if (url === 'home://newtab') {
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      return;
    }
    
    // Formatage de l'URL
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
```

#### `go-back` et `go-forward`
Navigation dans l'historique
```javascript
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
```

#### `reload`
Recharge la page
```javascript
ipcMain.handle('reload', (event, id) => {
  if (views.has(id)) {
    const view = views.get(id);
    view.webContents.reload();
  }
});
```

## 💾 Persistance des données

### Chemins de sauvegarde

```javascript
const userDataPath = app.getPath('userData');
const bookmarksPath = path.join(userDataPath, 'bookmarks.json');
const groupsPath = path.join(userDataPath, 'groups.json');
```

### Chargement des données

```javascript
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
```

### Sauvegarde des favoris

```javascript
function saveBookmarks() {
  fs.writeFileSync(bookmarksPath, JSON.stringify(bookmarks, null, 2));
}

ipcMain.handle('add-bookmark', (event, bookmark) => {
  bookmarks.push({ ...bookmark, id: Date.now().toString() });
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
```

### Sauvegarde des groupes

```javascript
function saveGroups() {
  fs.writeFileSync(groupsPath, JSON.stringify(Array.from(tabGroups.entries()), null, 2));
}

ipcMain.handle('create-group', (event, group) => {
  tabGroups.set(group.id, group);
  saveGroups();
  mainWindow.webContents.send('groups-updated', Array.from(tabGroups.entries()));
  return Array.from(tabGroups.entries());
});
```

## 🪟 Contrôles de fenêtre

### Minimiser
```javascript
ipcMain.handle('minimize-window', () => {
  mainWindow.minimize();
});
```

### Maximiser/Restaurer
```javascript
ipcMain.handle('maximize-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
```

### Fermer
```javascript
ipcMain.handle('close-window', () => {
  mainWindow.close();
});
```

## 📐 Gestion du redimensionnement

```javascript
mainWindow?.on('resize', () => {
  if (currentViewId && views.has(currentViewId)) {
    const view = views.get(currentViewId);
    const bounds = mainWindow.getBounds();
    view.setBounds({ 
      x: 0, 
      y: 140, 
      width: bounds.width, 
      height: bounds.height - 140 
    });
  }
});
```

## 🔐 Preload Script (preload.js)

Le script de préchargement expose une API sécurisée au processus de rendu :

```javascript
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
  // ... autres listeners
});
```

### Sécurité du preload

- ✅ Utilisation de `contextBridge` pour isolation
- ✅ Pas d'exposition directe de modules Node.js
- ✅ API limitée aux fonctions nécessaires
- ✅ Validation côté processus principal
