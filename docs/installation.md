# Installation et déploiement

Guide complet pour installer, développer et déployer le navigateur.

## 📋 Prérequis

### Système d'exploitation

Le navigateur fonctionne sur :
- ✅ **Windows** 10/11 (64-bit)
- ✅ **macOS** 10.13+ (High Sierra et supérieur)
- ✅ **Linux** (Ubuntu 18.04+, Fedora 24+, Debian 9+)

### Logiciels requis

| Logiciel | Version minimale | Recommandé |
|----------|------------------|------------|
| Node.js | 16.x | 18.x LTS |
| npm | 8.x | 9.x |
| Git | 2.x | Dernière |

### Vérification

```bash
# Vérifier Node.js
node --version
# Devrait afficher v16.x.x ou supérieur

# Vérifier npm
npm --version
# Devrait afficher 8.x.x ou supérieur

# Vérifier Git
git --version
# Devrait afficher git version 2.x.x
```

---

## 🚀 Installation

### 1. Cloner le repository

```bash
# Via HTTPS
git clone https://github.com/votre-username/browser.git

# Ou via SSH
git clone git@github.com:votre-username/browser.git

# Entrer dans le dossier
cd browser
```

### 2. Installer les dépendances

```bash
npm install
```

**Durée estimée** : 2-5 minutes (selon la connexion internet)

**Paquets installés** :
- Electron (~200 MB)
- React et dépendances
- Zustand, Lucide React
- Build tools (react-scripts, electron-builder)

### 3. Vérifier l'installation

```bash
# Lister les dépendances installées
npm list --depth=0

# Devrait afficher toutes les dépendances du package.json
```

---

## 💻 Développement

### Démarrer l'application

**Mode développement** :
```bash
npm start
```

Cette commande :
1. Lance le serveur de développement React (`localhost:3000`)
2. Attend que le serveur soit prêt
3. Lance Electron qui charge l'interface React
4. Active le Hot Reload (rechargement automatique)

**Sortie attendue** :
```
> concurrently "npm run react-start" "wait-on http://localhost:3000 && npm run electron"

[0] Starting the development server...
[0] Compiled successfully!
[0] You can now view browser-app in the browser.
[0]   Local:            http://localhost:3000

[1] > electron .
```

### Structure du mode développement

```
┌─────────────────────────────┐
│   Terminal 1: React Dev     │
│   Port: 3000                 │
│   Hot Reload: ✓              │
└─────────────────────────────┘
              ↓
┌─────────────────────────────┐
│   Electron Window            │
│   Loads: localhost:3000      │
│   DevTools: Available        │
└─────────────────────────────┘
```

### Arrêter l'application

- **Terminal** : `Ctrl+C` (2 fois si nécessaire)
- **Fenêtre** : Cliquer sur le bouton fermer rouge

### Ouvrir les DevTools

**Dans Electron** :
1. Lancer l'application
2. `Ctrl+Shift+I` (Windows/Linux) ou `Cmd+Option+I` (macOS)
3. Ou ajouter dans `main.js` : `mainWindow.webContents.openDevTools();`

**BrowserView DevTools** :
```javascript
// Dans main.js, après createBrowserView
view.webContents.openDevTools();
```

### Logs et debugging

**Console Electron (Main Process)** :
- Visible dans le terminal où vous avez lancé `npm start`
- `console.log()` dans `main.js` apparaît ici

**Console React (Renderer Process)** :
- Visible dans les DevTools Electron
- `console.log()` dans les composants React apparaît ici

**Console BrowserView (Pages web)** :
- Chaque BrowserView a sa propre console
- Ouvrir DevTools pour chaque BrowserView

### Modifications du code

**Rechargement automatique** :

| Fichier modifié | Rechargement | Action |
|----------------|--------------|--------|
| `src/**/*.js` | ✅ Auto | React Hot Reload |
| `src/**/*.css` | ✅ Auto | Style injection |
| `electron/**/*.js` | ❌ Manuel | Relancer `npm start` |
| `package.json` | ❌ Manuel | `npm install` puis relancer |

**Forcer un rechargement** :
- React : `Ctrl+R` dans la fenêtre Electron
- Electron : Arrêter et relancer `npm start`

---

## 🔨 Build de production

### Créer le build React

```bash
npm run build
```

Cette commande :
- Compile et optimise le code React
- Minifie JavaScript et CSS
- Génère les fichiers dans `/build`
- Active les optimisations de production

**Sortie** :
```
File sizes after gzip:

  XX.XX kB  build/static/js/main.xxxxx.js
  XX.XX kB  build/static/css/main.xxxxx.css

The build folder is ready to be deployed.
```

### Créer l'exécutable

```bash
npm run electron-build
```

ou directement :

```bash
npm run dist
```

Cette commande :
1. Exécute `npm run build` (si pas déjà fait)
2. Package l'application avec electron-builder
3. Crée les installateurs pour votre OS

**Durée** : 2-10 minutes selon l'OS et les ressources

### Sorties générées

**Windows** :
```
dist/
├── win-unpacked/              # Version non empaquetée (portable)
├── Browser Setup 1.0.0.exe    # Installateur NSIS
└── Browser 1.0.0.exe          # Exécutable portable
```

**macOS** :
```
dist/
├── mac/                       # Version non empaquetée
├── Browser-1.0.0.dmg          # Image disque
└── Browser-1.0.0.zip          # Archive
```

**Linux** :
```
dist/
├── linux-unpacked/            # Version non empaquetée
├── Browser-1.0.0.AppImage     # AppImage (recommandé)
├── Browser_1.0.0_amd64.deb    # Paquet Debian/Ubuntu
└── Browser-1.0.0.rpm          # Paquet Fedora/RedHat
```

### Tester le build

**Avant distribution** :
1. Naviguer dans `dist/`
2. Exécuter la version "unpacked"
3. Tester toutes les fonctionnalités
4. Vérifier les chemins de fichiers
5. Tester sur machine vierge si possible

---

## ⚙️ Configuration du build

### package.json - Section build

```json
{
  "build": {
    "appId": "com.yourcompany.browser",
    "productName": "MinimalBrowser",
    "directories": {
      "output": "dist"
    },
    "files": [
      "build/**/*",
      "electron/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": ["nsis", "portable"],
      "icon": "assets/icon.ico"
    },
    "mac": {
      "target": ["dmg", "zip"],
      "icon": "assets/icon.icns",
      "category": "public.app-category.productivity"
    },
    "linux": {
      "target": ["AppImage", "deb", "rpm"],
      "icon": "assets/icon.png",
      "category": "Network"
    }
  }
}
```

### Personnalisation

**Changer le nom** :
```json
"productName": "VotreNomDeNavigateur"
```

**Changer l'ID** :
```json
"appId": "com.votrecompagnie.votreapp"
```

**Ajouter une icône** :
1. Créer le dossier `assets/`
2. Ajouter les icônes :
   - `icon.ico` (Windows) - 256x256
   - `icon.icns` (macOS) - Multi-résolution
   - `icon.png` (Linux) - 512x512

**Générer les icônes** :
```bash
# Installer electron-icon-builder
npm install --save-dev electron-icon-builder

# Générer depuis une image source
electron-icon-builder --input=./assets/source.png --output=./assets
```

---

## 📦 Distribution

### Méthodes de distribution

#### 1. GitHub Releases

```bash
# Créer un tag
git tag v1.0.0
git push origin v1.0.0

# Uploader les fichiers de dist/ dans GitHub Releases
# Les utilisateurs téléchargent l'installateur pour leur OS
```

#### 2. Auto-update (Electron-updater)

**Installation** :
```bash
npm install electron-updater
```

**Configuration dans main.js** :
```javascript
const { autoUpdater } = require('electron-updater');

app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});
```

**Publier** :
```bash
# Utiliser electron-builder avec publish
npm run dist -- --publish always
```

#### 3. Microsoft Store (Windows)

**Prérequis** :
- Compte développeur Microsoft
- Certificat de signature

**Build** :
```bash
electron-builder --win appx
```

#### 4. Mac App Store

**Prérequis** :
- Compte Apple Developer
- Certificats de signature

**Build** :
```bash
electron-builder --mac mas
```

### Signature du code

**Windows** :
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
```

**macOS** :
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAM_ID)"
}
```

---

## 🧪 Tests

### Tests manuels

**Checklist avant release** :

- [ ] Toutes les fonctionnalités marchent
- [ ] Navigation back/forward
- [ ] Création/fermeture d'onglets
- [ ] Favoris sauvegardés/chargés
- [ ] Groupes d'onglets fonctionnels
- [ ] Page d'accueil s'affiche
- [ ] Pas d'erreurs console
- [ ] Build démarre correctement
- [ ] Données persistent après redémarrage

### Tests automatisés (à implémenter)

**Unit tests (Jest)** :
```bash
npm install --save-dev jest @testing-library/react
npm test
```

**E2E tests (Playwright)** :
```bash
npm install --save-dev playwright
npm run test:e2e
```

---

## 🔧 Dépannage

### Problèmes courants

#### Erreur "Cannot find module electron"

**Cause** : Electron pas installé correctement

**Solution** :
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

#### Port 3000 déjà utilisé

**Cause** : Autre application sur le port 3000

**Solution** :
```bash
# Trouver le processus
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Tuer le processus ou changer le port dans package.json
"scripts": {
  "react-start": "PORT=3001 react-scripts start"
}
```

#### Fenêtre Electron blanche

**Causes possibles** :
- Serveur React pas encore prêt
- Erreur JavaScript dans l'app

**Solutions** :
1. Attendre quelques secondes
2. Ouvrir DevTools et vérifier la console
3. Vérifier les logs du terminal

#### GPU Process erreur

**Message** :
```
ERROR:gpu_process_host.cc(991) GPU process exited unexpectedly
```

**Solution** :
```javascript
// Dans main.js
app.disableHardwareAcceleration();
```

#### Build échoue

**Cause** : Espace disque insuffisant ou permissions

**Solutions** :
```bash
# Nettoyer
rm -rf dist build node_modules
npm install
npm run build
```

### Logs de debug

**Activer les logs Electron** :
```bash
# Windows
set ELECTRON_ENABLE_LOGGING=1
npm start

# macOS/Linux
ELECTRON_ENABLE_LOGGING=1 npm start
```

**Logs détaillés du build** :
```bash
DEBUG=electron-builder npm run dist
```

---

## 🔄 Mises à jour

### Mettre à jour les dépendances

```bash
# Vérifier les packages obsolètes
npm outdated

# Mettre à jour tous les packages mineurs
npm update

# Mettre à jour un package spécifique
npm install electron@latest
npm install react@latest react-dom@latest
```

### Migrer vers une nouvelle version

**Electron** :
```bash
# Vérifier la compatibilité
npm info electron versions

# Installer la nouvelle version
npm install electron@27.0.0

# Tester
npm start
```

**React** :
```bash
npm install react@latest react-dom@latest react-scripts@latest
npm start
```

### Changelog

Maintenir un fichier `CHANGELOG.md` :
```markdown
# Changelog

## [1.0.0] - 2024-01-15
### Added
- Initial release
- Tab management
- Bookmarks system
- Tab groups

### Fixed
- Memory leak on tab close
```

---

## 📚 Ressources

### Documentation officielle

- [Electron](https://www.electronjs.org/docs)
- [React](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [electron-builder](https://www.electron.build/)

### Outils utiles

- [Electron Forge](https://www.electronforge.io/) - Alternative à electron-builder
- [Electron Fiddle](https://www.electronjs.org/fiddle) - Tester du code Electron
- [React DevTools](https://react.dev/learn/react-developer-tools) - Extension Chrome

### Communauté

- [Electron Discord](https://discord.gg/electron)
- [React Discord](https://discord.gg/react)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/electron)

---

## 🎯 Prochaines étapes

Après installation, consultez :
1. [Fonctionnalités](./fonctionnalites.md) - Découvrir toutes les fonctionnalités
2. [Architecture](./architecture.md) - Comprendre la structure
3. [Composants](./composants.md) - Détail des composants React
4. [Electron](./electron.md) - Processus principal Electron
5. [Store](./store.md) - Gestion d'état Zustand
