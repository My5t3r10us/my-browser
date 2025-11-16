# Composants React

Documentation détaillée de tous les composants de l'interface utilisateur.

## 📱 App.js

**Rôle** : Composant racine qui orchestre toute l'application.

### Responsabilités

- Initialisation des listeners IPC
- Création du premier onglet au démarrage
- Mise à jour du store avec les données du processus principal
- Conditionnement de l'affichage de la HomePage

### Structure

```javascript
function App() {
  const { tabs, activeTabId, addTab, updateTab, setBookmarks, setTabGroups } = useBrowserStore();

  useEffect(() => {
    // Setup des listeners
    window.electronAPI.onNavigationUpdated((data) => { ... });
    window.electronAPI.onTitleUpdated((data) => { ... });
    window.electronAPI.onFaviconUpdated((data) => { ... });
    window.electronAPI.onBookmarksUpdated((bookmarks) => { ... });
    window.electronAPI.onGroupsUpdated((groups) => { ... });
    
    // Création onglet initial
    if (tabs.length === 0) {
      addTab();
    }
    
    // Cleanup
    return () => { /* removeAllListeners */ };
  }, []);

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
```

### Props
Aucune prop, utilise le store directement.

---

## 🎯 TitleBar.js

**Rôle** : Barre de titre personnalisée avec contrôles de fenêtre.

### Fonctionnalités

- Affichage du titre de l'application
- Boutons minimiser, maximiser, fermer
- Style macOS-like avec boutons colorés

### Code clé

```javascript
const TitleBar = () => {
  const handleMinimize = () => window.electronAPI.minimizeWindow();
  const handleMaximize = () => window.electronAPI.maximizeWindow();
  const handleClose = () => window.electronAPI.closeWindow();

  return (
    <div className="title-bar">
      <div className="title-text">Browser</div>
      <div className="window-controls">
        <button className="window-control minimize" onClick={handleMinimize} />
        <button className="window-control maximize" onClick={handleMaximize} />
        <button className="window-control close" onClick={handleClose} />
      </div>
    </div>
  );
};
```

### Styles

- Hauteur fixe : 32px
- Couleur de fond : `#e8e8e8`
- Boutons circulaires colorés (rouge, jaune, vert)
- Zone draggable : `-webkit-app-region: drag`

### Props
Aucune prop.

---

## 📑 TabBar.js

**Rôle** : Gestion et affichage des onglets et groupes d'onglets.

### Fonctionnalités

- **Affichage des onglets** avec titre, favicon et bouton fermer
- **Groupes d'onglets** avec couleur et nom
- **Drag & Drop** pour ajouter des onglets aux groupes
- **Réduire/Développer** les groupes
- **Bouton nouvel onglet**
- **Menu de gestion des groupes**

### Structure des données

```javascript
const {
  tabs,              // Array<Tab>
  activeTabId,       // string
  tabGroups,         // Map<id, Group>
  addTab,
  setActiveTab,
  closeTab,
  toggleGroupCollapse
} = useBrowserStore();
```

### Rendu d'un onglet

```javascript
const renderTab = (tab) => {
  const favicon = tab.favicon || defaultFavicon;
  
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
      <div className="tab-close" onClick={(e) => {
        e.stopPropagation();
        closeTab(tab.id);
      }}>
        <X size={12} />
      </div>
    </div>
  );
};
```

### Rendu d'un groupe

```javascript
const renderGroup = (group) => {
  const groupTabs = tabs.filter(tab => tab.groupId === group.id);
  
  if (group.isCollapsed) {
    return (
      <div className="tab-group collapsed" onClick={() => toggleGroupCollapse(group.id)}>
        <div className="tab-group-header" style={{ backgroundColor: group.color }}>
          <ChevronRight size={14} />
          <span>{group.name}</span>
          <span>({groupTabs.length})</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="tab-group"
      style={{ backgroundColor: group.color + '10' }}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, group.id)}
    >
      <div className="tab-group-header" style={{ backgroundColor: group.color }}>
        <ChevronDown size={14} />
        <span>{group.name}</span>
      </div>
      {groupTabs.map(renderTab)}
    </div>
  );
};
```

### Drag & Drop

```javascript
const [draggedTab, setDraggedTab] = useState(null);
const [dragOverGroup, setDragOverGroup] = useState(null);

const handleDragStart = (e, tabId) => {
  setDraggedTab(tabId);
  e.dataTransfer.effectAllowed = 'move';
};

const handleDrop = async (e, groupId) => {
  e.preventDefault();
  if (draggedTab && groupId) {
    const store = useBrowserStore.getState();
    await store.addTabToGroup(draggedTab, groupId);
  }
  setDraggedTab(null);
};
```

### Props
Aucune prop, utilise le store.

---

## 🎨 TabGroupMenu.js

**Rôle** : Menu dropdown pour créer et gérer les groupes d'onglets.

### Fonctionnalités

- **Liste des groupes** existants avec leur couleur
- **Supprimer un groupe** (icône X)
- **Créer un nouveau groupe** avec nom et couleur
- **15 couleurs** prédéfinies au choix

### État local

```javascript
const [isCreating, setIsCreating] = useState(false);
const [newGroupName, setNewGroupName] = useState('');
const [selectedColor, setSelectedColor] = useState('#3b82f6');
```

### Palette de couleurs

```javascript
const colors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#ec4899', '#f43f5e', '#6b7280'
];
```

### Création d'un groupe

```javascript
const handleCreateGroup = async () => {
  if (newGroupName.trim()) {
    await createGroup(newGroupName, selectedColor);
    setNewGroupName('');
    setIsCreating(false);
  }
};
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `onClose` | function | Callback pour fermer le menu |

---

## 🧭 NavigationBar.js

**Rôle** : Barre de navigation avec contrôles et barre d'URL.

### Fonctionnalités

- **Boutons de navigation** : Retour, Avant, Recharger, Accueil
- **Barre d'URL** avec auto-complétion
- **Bouton étoile** pour ajouter/retirer des favoris
- **État désactivé** pour les boutons non disponibles

### État local

```javascript
const [urlValue, setUrlValue] = useState('');
const [isEditing, setIsEditing] = useState(false);
```

### Synchronisation de l'URL

```javascript
useEffect(() => {
  if (!isEditing && activeTab) {
    setUrlValue(activeTab.url === 'home://newtab' ? '' : activeTab.url);
  }
}, [activeTab, isEditing]);
```

### Navigation

```javascript
const handleNavigate = () => {
  if (urlValue.trim()) {
    navigateTo(urlValue);
    setIsEditing(false);
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleNavigate();
  }
};
```

### Gestion des favoris

```javascript
const toggleBookmark = async () => {
  if (!activeTab || activeTab.url === 'home://newtab') return;
  
  const bookmarkForUrl = bookmarks.find(b => b.url === activeTab.url);
  
  if (bookmarkForUrl) {
    await removeBookmark(bookmarkForUrl.id);
  } else {
    await addBookmark(activeTab.title, activeTab.url);
  }
};

const isCurrentPageBookmarked = activeTab && isBookmarked(activeTab.url);
```

### Structure

```javascript
<div className="navigation-bar">
  <button onClick={goBack} disabled={!activeTab?.canGoBack}>
    <ArrowLeft />
  </button>
  
  <button onClick={goForward} disabled={!activeTab?.canGoForward}>
    <ArrowRight />
  </button>
  
  <button onClick={reload}>
    <RotateCw />
  </button>
  
  <button onClick={() => navigateTo('home://newtab')}>
    <Home />
  </button>
  
  <input
    className="url-bar"
    value={urlValue}
    onChange={(e) => setUrlValue(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="Search or enter web address"
  />
  
  <button onClick={toggleBookmark}>
    {isCurrentPageBookmarked ? <Star fill="currentColor" /> : <StarOff />}
  </button>
</div>
```

### Props
Aucune prop, utilise le store.

---

## ⭐ BookmarksBar.js

**Rôle** : Barre affichant les favoris enregistrés.

### Fonctionnalités

- **Liste des favoris** avec icône et titre
- **Navigation au clic** vers l'URL du favori
- **Troncature des titres** longs (max 20 caractères)
- **Message par défaut** si aucun favori

### Rendu

```javascript
const BookmarksBar = () => {
  const { bookmarks, navigateTo } = useBrowserStore();
  
  if (bookmarks.length === 0) {
    return (
      <div className="bookmarks-bar">
        <span style={{ fontSize: '12px', color: '#999' }}>
          No bookmarks yet. Click the star icon to add bookmarks.
        </span>
      </div>
    );
  }
  
  return (
    <div className="bookmarks-bar">
      {bookmarks.map(bookmark => (
        <div
          key={bookmark.id}
          className="bookmark-item"
          onClick={() => navigateTo(bookmark.url)}
          title={bookmark.url}
        >
          <Globe size={14} className="bookmark-favicon" />
          <span>
            {bookmark.title.substring(0, 20)}
            {bookmark.title.length > 20 ? '...' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};
```

### Props
Aucune prop, utilise le store.

---

## 🏠 HomePage.js

**Rôle** : Page d'accueil personnalisée affichée pour les nouveaux onglets.

### Fonctionnalités

- **Barre de recherche** centrale
- **Liens rapides** vers les sites populaires
- **Icônes colorées** pour chaque lien
- **Recherche Google** au clavier (Enter)

### État local

```javascript
const [searchQuery, setSearchQuery] = useState('');
```

### Liens rapides prédéfinis

```javascript
const quickLinks = [
  { title: 'Google', url: 'https://www.google.com', icon: <Search /> },
  { title: 'YouTube', url: 'https://www.youtube.com', icon: <Youtube /> },
  { title: 'GitHub', url: 'https://www.github.com', icon: <Github /> },
  { title: 'Twitter', url: 'https://www.twitter.com', icon: <Twitter /> },
  { title: 'Gmail', url: 'https://mail.google.com', icon: <Mail /> },
  { title: 'Amazon', url: 'https://www.amazon.com', icon: <ShoppingBag /> },
  { title: 'Wikipedia', url: 'https://www.wikipedia.org', icon: <BookOpen /> },
  { title: 'Reddit', url: 'https://www.reddit.com', icon: <Globe /> }
];
```

### Recherche

```javascript
const handleSearch = () => {
  if (searchQuery.trim()) {
    const query = encodeURIComponent(searchQuery);
    navigateTo(`https://www.google.com/search?q=${query}`);
  }
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};
```

### Structure

```javascript
<div className="home-page">
  <div className="home-logo">
    <Globe size={64} />
  </div>
  
  <div className="home-search">
    <input
      type="text"
      className="home-search-input"
      placeholder="Search the web..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      autoFocus
    />
  </div>
  
  <div className="quick-links">
    {quickLinks.map(link => (
      <div className="quick-link" onClick={() => navigateTo(link.url)}>
        <div className="quick-link-icon">{link.icon}</div>
        <span className="quick-link-title">{link.title}</span>
      </div>
    ))}
  </div>
</div>
```

### Design

- Fond dégradé gris clair
- Logo centré
- Barre de recherche arrondie (border-radius: 24px)
- Grille de liens responsive
- Effet hover avec élévation

### Props
Aucune prop, utilise le store.

---

## 🎨 Styles partagés

### Variables de couleurs

```css
/* Tons neutres */
Background: #ffffff
Surface: #f5f5f5, #f0f0f0, #fafafa, #f8f8f8
Border: #ddd, #e0e0e0
Text: #333, #444, #666, #999
```

### Composants réutilisables

#### Boutons
```css
.nav-button, .new-tab-button {
  border-radius: 6px;
  transition: background 0.2s;
}
.nav-button:hover {
  background: rgba(0, 0, 0, 0.05);
}
```

#### Inputs
```css
.url-bar, .home-search-input {
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.2s;
}
input:focus {
  outline: none;
  border-color: #999;
}
```

### Animations

```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```
