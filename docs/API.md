# API Reference

Référence rapide de toutes les APIs et méthodes disponibles.

## 🗄️ Store API (Zustand)

### État global

```typescript
interface BrowserStore {
  // State
  tabs: Tab[];
  activeTabId: string | null;
  bookmarks: Bookmark[];
  tabGroups: Map<string, TabGroup>;
  
  // Actions
  addTab: (url?: string) => string;
  setActiveTab: (id: string) => void;
  closeTab: (id: string) => void;
  updateTab: (id: string, updates: Partial<Tab>) => void;
  navigateTo: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (title: string, url: string) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  isBookmarked: (url: string) => boolean;
  setTabGroups: (groups: [string, TabGroup][]) => void;
  createGroup: (name: string, color: string) => Promise<string>;
  addTabToGroup: (tabId: string, groupId: string) => Promise<void>;
  removeTabFromGroup: (tabId: string) => Promise<void>;
  toggleGroupCollapse: (groupId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
}
```

### Types

```typescript
interface Tab {
  id: string;
  url: string;
  title: string;
  favicon: string | null;
  canGoBack: boolean;
  canGoForward: boolean;
  groupId: string | null;
  isLoading: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface TabGroup {
  id: string;
  name: string;
  color: string;
  isCollapsed: boolean;
  tabs: string[];
}
```

---

## 📡 Electron IPC API

### Renderer → Main (invoke/handle)

#### Tab Management

```typescript
// Créer un onglet
window.electronAPI.createTab(data: { id: string, url: string })
  => Promise<{ id: string, url: string }>

// Changer d'onglet
window.electronAPI.switchTab(id: string)
  => Promise<boolean>

// Fermer un onglet
window.electronAPI.closeTab(id: string)
  => Promise<boolean>
```

#### Navigation

```typescript
// Naviguer vers une URL
window.electronAPI.navigate(data: { id: string, url: string })
  => Promise<void>

// Retour en arrière
window.electronAPI.goBack(id: string)
  => Promise<void>

// Avant
window.electronAPI.goForward(id: string)
  => Promise<void>

// Recharger
window.electronAPI.reload(id: string)
  => Promise<void>
```

#### Bookmarks

```typescript
// Ajouter un favori
window.electronAPI.addBookmark(bookmark: { title: string, url: string })
  => Promise<Bookmark[]>

// Supprimer un favori
window.electronAPI.removeBookmark(id: string)
  => Promise<Bookmark[]>

// Obtenir les favoris
window.electronAPI.getBookmarks()
  => Promise<Bookmark[]>
```

#### Tab Groups

```typescript
// Créer un groupe
window.electronAPI.createGroup(group: TabGroup)
  => Promise<[string, TabGroup][]>

// Mettre à jour un groupe
window.electronAPI.updateGroup(data: { id: string, updates: Partial<TabGroup> })
  => Promise<[string, TabGroup][]>

// Supprimer un groupe
window.electronAPI.deleteGroup(id: string)
  => Promise<[string, TabGroup][]>
```

#### Window Controls

```typescript
// Minimiser la fenêtre
window.electronAPI.minimizeWindow()
  => Promise<void>

// Maximiser/Restaurer la fenêtre
window.electronAPI.maximizeWindow()
  => Promise<void>

// Fermer la fenêtre
window.electronAPI.closeWindow()
  => Promise<void>
```

### Main → Renderer (send/on)

#### Event Listeners

```typescript
// Navigation mise à jour
window.electronAPI.onNavigationUpdated(callback: (data: {
  id: string,
  url: string,
  canGoBack: boolean,
  canGoForward: boolean
}) => void)

// Titre mis à jour
window.electronAPI.onTitleUpdated(callback: (data: {
  id: string,
  title: string
}) => void)

// Favicon mis à jour
window.electronAPI.onFaviconUpdated(callback: (data: {
  id: string,
  favicon: string
}) => void)

// Favoris mis à jour
window.electronAPI.onBookmarksUpdated(callback: (bookmarks: Bookmark[]) => void)

// Groupes mis à jour
window.electronAPI.onGroupsUpdated(callback: (groups: [string, TabGroup][]) => void)

// Retirer tous les listeners
window.electronAPI.removeAllListeners(channel: string)
```

---

## 🎨 Components API

### TitleBar

```typescript
interface TitleBarProps {}

const TitleBar: React.FC<TitleBarProps>
```

**Événements** :
- `onClick` bouton minimize → `window.electronAPI.minimizeWindow()`
- `onClick` bouton maximize → `window.electronAPI.maximizeWindow()`
- `onClick` bouton close → `window.electronAPI.closeWindow()`

---

### TabBar

```typescript
interface TabBarProps {}

const TabBar: React.FC<TabBarProps>
```

**Événements** :
- `onClick` tab → `setActiveTab(id)`
- `onClick` close → `closeTab(id)`
- `onClick` new tab → `addTab()`
- `onDragStart` tab → Début du drag
- `onDrop` sur groupe → `addTabToGroup(tabId, groupId)`

---

### TabGroupMenu

```typescript
interface TabGroupMenuProps {
  onClose: () => void;
}

const TabGroupMenu: React.FC<TabGroupMenuProps>
```

**Méthodes** :
- `handleCreateGroup()` → `createGroup(name, color)`
- `handleDeleteGroup(id)` → `deleteGroup(id)`

---

### NavigationBar

```typescript
interface NavigationBarProps {}

const NavigationBar: React.FC<NavigationBarProps>
```

**Événements** :
- `onClick` back → `goBack()`
- `onClick` forward → `goForward()`
- `onClick` reload → `reload()`
- `onClick` home → `navigateTo('home://newtab')`
- `onChange` URL → `setUrlValue(value)`
- `onKeyPress` Enter → `navigateTo(urlValue)`
- `onClick` star → `toggleBookmark()`

---

### BookmarksBar

```typescript
interface BookmarksBarProps {}

const BookmarksBar: React.FC<BookmarksBarProps>
```

**Événements** :
- `onClick` bookmark → `navigateTo(bookmark.url)`

---

### HomePage

```typescript
interface HomePageProps {}

const HomePage: React.FC<HomePageProps>
```

**Événements** :
- `onChange` search → `setSearchQuery(value)`
- `onKeyPress` Enter → `navigateTo(searchUrl)`
- `onClick` quick link → `navigateTo(link.url)`

---

## 🔧 Electron Main Process API

### BrowserView Management

```typescript
// Créer une BrowserView
createBrowserView(id: string, url?: string): BrowserView

// Configuration
view.setBounds(bounds: {
  x: number,
  y: number,
  width: number,
  height: number
})

view.setAutoResize(options: {
  width: boolean,
  height: boolean
})

// Navigation
view.webContents.loadURL(url: string)
view.webContents.goBack()
view.webContents.goForward()
view.webContents.reload()

// État
view.webContents.canGoBack(): boolean
view.webContents.canGoForward(): boolean
```

### Data Persistence

```typescript
// Chemins
const userDataPath = app.getPath('userData')
const bookmarksPath = path.join(userDataPath, 'bookmarks.json')
const groupsPath = path.join(userDataPath, 'groups.json')

// Chargement
loadData(): void

// Sauvegarde
saveBookmarks(): void
saveGroups(): void
```

### Window Management

```typescript
// Fenêtre principale
mainWindow.minimize()
mainWindow.maximize()
mainWindow.unmaximize()
mainWindow.isMaximized(): boolean
mainWindow.close()

// Bounds
mainWindow.getBounds(): {
  x: number,
  y: number,
  width: number,
  height: number
}
```

---

## 📝 Constantes

### URLs spéciales

```typescript
const SPECIAL_URLS = {
  NEW_TAB: 'home://newtab',
  ABOUT_BLANK: 'about:blank'
}
```

### Dimensions UI

```typescript
const UI_DIMENSIONS = {
  TITLE_BAR_HEIGHT: 32,      // px
  TAB_BAR_MIN_HEIGHT: 36,    // px
  NAVIGATION_BAR_HEIGHT: 48, // px
  BOOKMARKS_BAR_HEIGHT: 32,  // px
  TOTAL_UI_HEIGHT: 140       // px (pour les BrowserViews)
}
```

### Couleurs des groupes

```typescript
const GROUP_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#22c55e', // Green
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#6b7280'  // Gray
]
```

---

## 🔍 Exemples d'utilisation

### Créer et naviguer dans un onglet

```javascript
import useBrowserStore from './store/browserStore';

function MyComponent() {
  const { addTab, navigateTo } = useBrowserStore();
  
  const openGoogleInNewTab = () => {
    const tabId = addTab();
    navigateTo('https://www.google.com');
  };
  
  return <button onClick={openGoogleInNewTab}>Open Google</button>;
}
```

### Gérer les favoris

```javascript
function BookmarkButton() {
  const { activeTab, bookmarks, addBookmark, removeBookmark, isBookmarked } = useBrowserStore(
    state => ({
      activeTab: state.tabs.find(t => t.id === state.activeTabId),
      bookmarks: state.bookmarks,
      addBookmark: state.addBookmark,
      removeBookmark: state.removeBookmark,
      isBookmarked: state.isBookmarked
    })
  );
  
  const toggleBookmark = () => {
    if (!activeTab) return;
    
    const bookmark = bookmarks.find(b => b.url === activeTab.url);
    if (bookmark) {
      removeBookmark(bookmark.id);
    } else {
      addBookmark(activeTab.title, activeTab.url);
    }
  };
  
  const isCurrentBookmarked = activeTab && isBookmarked(activeTab.url);
  
  return (
    <button onClick={toggleBookmark}>
      {isCurrentBookmarked ? '★' : '☆'}
    </button>
  );
}
```

### Créer un groupe d'onglets

```javascript
function CreateGroupButton() {
  const { createGroup, addTabToGroup, tabs } = useBrowserStore();
  
  const createWorkGroup = async () => {
    // Créer le groupe
    const groupId = await createGroup('Work', '#3b82f6');
    
    // Ajouter les onglets Gmail et Drive
    const gmailTab = tabs.find(t => t.url.includes('gmail.com'));
    const driveTab = tabs.find(t => t.url.includes('drive.google.com'));
    
    if (gmailTab) await addTabToGroup(gmailTab.id, groupId);
    if (driveTab) await addTabToGroup(driveTab.id, groupId);
  };
  
  return <button onClick={createWorkGroup}>Create Work Group</button>;
}
```

### Écouter les événements Electron

```javascript
import { useEffect } from 'react';

function App() {
  const { updateTab } = useBrowserStore();
  
  useEffect(() => {
    // Setup listeners
    const handleNavigation = (data) => {
      updateTab(data.id, {
        url: data.url,
        canGoBack: data.canGoBack,
        canGoForward: data.canGoForward,
        isLoading: false
      });
    };
    
    window.electronAPI.onNavigationUpdated(handleNavigation);
    
    // Cleanup
    return () => {
      window.electronAPI.removeAllListeners('navigation-updated');
    };
  }, [updateTab]);
  
  return <div>...</div>;
}
```

---

## 🚨 Codes d'erreur

### Electron IPC

| Code | Description | Solution |
|------|-------------|----------|
| `ENOENT` | Fichier non trouvé | Vérifier le chemin |
| `EACCES` | Permission refusée | Vérifier les permissions |
| `ERR_INVALID_URL` | URL invalide | Formater l'URL correctement |

### Store

| Erreur | Cause | Solution |
|--------|-------|----------|
| `Tab not found` | ID invalide | Vérifier que l'onglet existe |
| `Group not found` | ID invalide | Vérifier que le groupe existe |

---

## 📚 Voir aussi

- [Architecture](./architecture.md) - Vue d'ensemble du système
- [Store](./store.md) - Documentation détaillée du store
- [Electron](./electron.md) - Documentation Electron complète
- [Composants](./composants.md) - Documentation des composants
