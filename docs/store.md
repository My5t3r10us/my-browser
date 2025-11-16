# Store Zustand

Documentation complète de la gestion d'état avec Zustand.

## 📦 Vue d'ensemble

Le store Zustand centralise tout l'état de l'application et gère la communication avec le processus Electron.

```javascript
import { create } from 'zustand';

const useBrowserStore = create((set, get) => ({
  // État
  tabs: [],
  activeTabId: null,
  bookmarks: [],
  tabGroups: new Map(),
  
  // Actions
  addTab: () => { ... },
  setActiveTab: () => { ... },
  // ... autres actions
}));
```

## 🗂️ Structure de l'état

### Tabs (Onglets)

```typescript
interface Tab {
  id: string;              // Identifiant unique (timestamp)
  url: string;             // URL actuelle
  title: string;           // Titre de la page
  favicon: string | null;  // URL du favicon
  canGoBack: boolean;      // Peut naviguer en arrière
  canGoForward: boolean;   // Peut naviguer en avant
  groupId: string | null;  // ID du groupe (si dans un groupe)
  isLoading: boolean;      // Chargement en cours
}
```

### Bookmarks (Favoris)

```typescript
interface Bookmark {
  id: string;     // Identifiant unique
  title: string;  // Titre du favori
  url: string;    // URL du site
}
```

### Tab Groups (Groupes d'onglets)

```typescript
interface TabGroup {
  id: string;           // Identifiant unique
  name: string;         // Nom du groupe
  color: string;        // Couleur (hex)
  isCollapsed: boolean; // État réduit/développé
  tabs: string[];       // IDs des onglets du groupe
}
```

## 🎯 Actions du store

### Gestion des onglets

#### `addTab(url = 'home://newtab')`

Crée un nouvel onglet et le rend actif.

```javascript
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
  
  // Communication avec Electron
  window.electronAPI.createTab({ id, url });
  window.electronAPI.switchTab(id);
  
  return id;
}
```

**Paramètres** :
- `url` (string, optional) : URL de départ (défaut: `'home://newtab'`)

**Retour** : `string` - ID du nouvel onglet

**Effets de bord** :
- Ajoute l'onglet au state
- Définit comme onglet actif
- Crée une BrowserView dans Electron

---

#### `setActiveTab(id)`

Change l'onglet actif.

```javascript
setActiveTab: (id) => {
  set({ activeTabId: id });
  window.electronAPI.switchTab(id);
}
```

**Paramètres** :
- `id` (string) : ID de l'onglet à activer

**Effets de bord** :
- Met à jour `activeTabId`
- Affiche la BrowserView correspondante dans Electron

---

#### `closeTab(id)`

Ferme un onglet et active l'onglet précédent si nécessaire.

```javascript
closeTab: (id) => {
  const state = get();
  const tabIndex = state.tabs.findIndex(t => t.id === id);
  const newTabs = state.tabs.filter(t => t.id !== id);
  
  window.electronAPI.closeTab(id);
  
  if (state.activeTabId === id && newTabs.length > 0) {
    const newActiveTab = newTabs[Math.max(0, tabIndex - 1)];
    set({
      tabs: newTabs,
      activeTabId: newActiveTab.id
    });
    window.electronAPI.switchTab(newActiveTab.id);
  } else {
    set({ tabs: newTabs });
  }
}
```

**Paramètres** :
- `id` (string) : ID de l'onglet à fermer

**Logique** :
1. Trouve l'index de l'onglet
2. Filtre l'onglet de la liste
3. Si c'était l'onglet actif, active l'onglet précédent
4. Supprime la BrowserView dans Electron

---

#### `updateTab(id, updates)`

Met à jour les propriétés d'un onglet.

```javascript
updateTab: (id, updates) => {
  set(state => ({
    tabs: state.tabs.map(tab =>
      tab.id === id ? { ...tab, ...updates } : tab
    )
  }));
}
```

**Paramètres** :
- `id` (string) : ID de l'onglet
- `updates` (object) : Propriétés à mettre à jour

**Exemple** :
```javascript
updateTab('123456789', {
  title: 'Google',
  url: 'https://www.google.com',
  favicon: 'https://www.google.com/favicon.ico',
  isLoading: false
});
```

---

### Navigation

#### `navigateTo(url)`

Navigue vers une URL dans l'onglet actif.

```javascript
navigateTo: (url) => {
  const state = get();
  if (state.activeTabId) {
    window.electronAPI.navigate({ id: state.activeTabId, url });
    get().updateTab(state.activeTabId, { url, isLoading: true });
  }
}
```

**Paramètres** :
- `url` (string) : URL de destination

**Comportement** :
- Si pas de protocole et contient un "." → ajoute `https://`
- Si pas de "." ou contient espaces → recherche Google
- `home://newtab` → affiche la HomePage

---

#### `goBack()`

Navigue vers la page précédente dans l'historique.

```javascript
goBack: () => {
  const state = get();
  if (state.activeTabId) {
    window.electronAPI.goBack(state.activeTabId);
  }
}
```

**Condition** : Fonctionne seulement si `canGoBack === true`

---

#### `goForward()`

Navigue vers la page suivante dans l'historique.

```javascript
goForward: () => {
  const state = get();
  if (state.activeTabId) {
    window.electronAPI.goForward(state.activeTabId);
  }
}
```

**Condition** : Fonctionne seulement si `canGoForward === true`

---

#### `reload()`

Recharge la page actuelle.

```javascript
reload: () => {
  const state = get();
  if (state.activeTabId) {
    window.electronAPI.reload(state.activeTabId);
    get().updateTab(state.activeTabId, { isLoading: true });
  }
}
```

---

### Favoris

#### `setBookmarks(bookmarks)`

Définit la liste complète des favoris (utilisé au chargement initial).

```javascript
setBookmarks: (bookmarks) => set({ bookmarks })
```

**Paramètres** :
- `bookmarks` (Array<Bookmark>) : Liste des favoris

---

#### `addBookmark(title, url)`

Ajoute un nouveau favori.

```javascript
addBookmark: async (title, url) => {
  const bookmarks = await window.electronAPI.addBookmark({ title, url });
  set({ bookmarks });
}
```

**Paramètres** :
- `title` (string) : Titre du favori
- `url` (string) : URL du site

**Retour** : `Promise<void>`

**Persistance** : Sauvegardé automatiquement dans `bookmarks.json`

---

#### `removeBookmark(id)`

Supprime un favori.

```javascript
removeBookmark: async (id) => {
  const bookmarks = await window.electronAPI.removeBookmark(id);
  set({ bookmarks });
}
```

**Paramètres** :
- `id` (string) : ID du favori à supprimer

---

#### `isBookmarked(url)`

Vérifie si une URL est dans les favoris.

```javascript
isBookmarked: (url) => {
  const state = get();
  return state.bookmarks.some(b => b.url === url);
}
```

**Paramètres** :
- `url` (string) : URL à vérifier

**Retour** : `boolean`

---

### Groupes d'onglets

#### `setTabGroups(groups)`

Définit la liste complète des groupes (utilisé au chargement initial).

```javascript
setTabGroups: (groups) => {
  set({ tabGroups: new Map(groups) });
}
```

**Paramètres** :
- `groups` (Array<[id, TabGroup]>) : Paires [id, groupe]

---

#### `createGroup(name, color)`

Crée un nouveau groupe d'onglets.

```javascript
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
}
```

**Paramètres** :
- `name` (string) : Nom du groupe
- `color` (string) : Couleur en format hex (ex: `'#3b82f6'`)

**Retour** : `Promise<string>` - ID du nouveau groupe

---

#### `addTabToGroup(tabId, groupId)`

Ajoute un onglet à un groupe.

```javascript
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
}
```

**Paramètres** :
- `tabId` (string) : ID de l'onglet
- `groupId` (string) : ID du groupe

**Effets** :
- Ajoute l'onglet à la liste du groupe
- Met à jour `groupId` de l'onglet
- Sauvegarde dans `groups.json`

---

#### `removeTabFromGroup(tabId)`

Retire un onglet de son groupe.

```javascript
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
}
```

**Paramètres** :
- `tabId` (string) : ID de l'onglet à retirer

---

#### `toggleGroupCollapse(groupId)`

Réduit ou développe un groupe.

```javascript
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
}
```

**Paramètres** :
- `groupId` (string) : ID du groupe

**Effet visuel** :
- Groupe réduit : Affiche seulement l'en-tête avec le nombre d'onglets
- Groupe développé : Affiche tous les onglets

---

#### `deleteGroup(groupId)`

Supprime un groupe (mais garde les onglets).

```javascript
deleteGroup: async (groupId) => {
  const state = get();
  // Retirer le groupe de tous les onglets
  state.tabs.forEach(tab => {
    if (tab.groupId === groupId) {
      get().updateTab(tab.id, { groupId: null });
    }
  });
  const groups = await window.electronAPI.deleteGroup(groupId);
  set({ tabGroups: new Map(groups) });
}
```

**Paramètres** :
- `groupId` (string) : ID du groupe à supprimer

**Comportement** :
- Les onglets du groupe deviennent des onglets normaux
- Le groupe est supprimé de `groups.json`

---

## 🔄 Flux de données typique

### Exemple : Créer un nouvel onglet et naviguer

```
1. User clicks "+" button
   └─> TabBar.js
       └─> addTab() from store

2. Store creates tab object
   └─> set({ tabs: [...tabs, newTab], activeTabId: id })
   
3. Store calls Electron API
   └─> window.electronAPI.createTab({ id, url })
   
4. Electron creates BrowserView
   └─> createBrowserView(id, url)
   
5. Page loads in BrowserView
   └─> webContents.on('did-navigate', ...)
   
6. Electron sends event to renderer
   └─> mainWindow.webContents.send('navigation-updated', data)
   
7. App.js receives event
   └─> window.electronAPI.onNavigationUpdated(callback)
   
8. Store updates tab
   └─> updateTab(id, { url, canGoBack, canGoForward })
   
9. React re-renders components
   └─> TabBar, NavigationBar updated
```

## 🎣 Utilisation dans les composants

### Hook de base

```javascript
import useBrowserStore from '../store/browserStore';

function MyComponent() {
  const { tabs, addTab } = useBrowserStore();
  
  return (
    <button onClick={() => addTab()}>
      New Tab ({tabs.length})
    </button>
  );
}
```

### Sélection optimisée

Pour éviter les re-renders inutiles :

```javascript
// ❌ Mauvais : re-render à chaque changement du store
const store = useBrowserStore();

// ✅ Bon : re-render seulement si tabs ou activeTabId change
const { tabs, activeTabId } = useBrowserStore(
  state => ({ tabs: state.tabs, activeTabId: state.activeTabId })
);
```

### Accès aux actions uniquement

```javascript
// Pas de re-render, juste accès aux actions
const addTab = useBrowserStore(state => state.addTab);
const navigateTo = useBrowserStore(state => state.navigateTo);
```

### Accès au state complet dans une action

```javascript
// Utiliser get() pour lire le state dans une action
const myAction = () => {
  const state = useBrowserStore.getState();
  const currentTab = state.tabs.find(t => t.id === state.activeTabId);
  // ...
};
```

## 💡 Bonnes pratiques

1. **Actions asynchrones** : Toujours utiliser `async/await` pour les appels Electron
2. **Immutabilité** : Toujours créer de nouveaux objets/arrays
3. **Sélecteurs** : Utiliser des sélecteurs pour optimiser les performances
4. **Cleanup** : Retirer les listeners dans `useEffect` cleanup
5. **Erreurs** : Gérer les erreurs des appels IPC avec try/catch
