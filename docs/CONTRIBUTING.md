# Guide de contribution

Merci de votre intérêt pour contribuer au projet ! Ce guide vous aidera à démarrer.

## 🌟 Comment contribuer

### Types de contributions

Nous acceptons les contributions suivantes :
- 🐛 **Corrections de bugs**
- ✨ **Nouvelles fonctionnalités**
- 📝 **Amélioration de la documentation**
- 🎨 **Améliorations UI/UX**
- ⚡ **Optimisations de performance**
- 🧪 **Ajout de tests**

---

## 🚀 Démarrage rapide

### 1. Fork et clone

```bash
# Forker le repo sur GitHub puis :
git clone https://github.com/votre-username/browser.git
cd browser
git remote add upstream https://github.com/original-repo/browser.git
```

### 2. Créer une branche

```bash
# Pour une nouvelle fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Pour un bug fix
git checkout -b fix/description-du-bug

# Pour de la documentation
git checkout -b docs/description
```

### 3. Installer les dépendances

```bash
npm install
```

### 4. Développer

```bash
npm start
# Faites vos modifications
```

### 5. Tester

```bash
# Tests manuels
npm start

# Tests automatisés (si disponibles)
npm test
```

### 6. Commit

```bash
git add .
git commit -m "type: description courte"
```

### 7. Push et Pull Request

```bash
git push origin nom-de-votre-branche
# Créer une Pull Request sur GitHub
```

---

## 📝 Standards de code

### Style JavaScript/React

**ESLint** : Nous utilisons ESLint avec la config React

```javascript
// ✅ Bon
const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return <div className="my-component">Content</div>;
};

// ❌ Éviter
function MyComponent() {
  var state = useState(initialValue)[0];
  // Pas de cleanup dans useEffect
  return <div class="my-component">Content</div>;
}
```

### Conventions de nommage

**Fichiers** :
- Composants : `PascalCase.js` (ex: `TabBar.js`)
- Utilitaires : `camelCase.js` (ex: `helpers.js`)
- Styles : `kebab-case.css` ou `Component.css`

**Variables et fonctions** :
```javascript
// camelCase pour les variables et fonctions
const activeTab = tabs.find(t => t.id === activeTabId);
const handleClick = () => { ... };

// PascalCase pour les composants
const TabBar = () => { ... };

// UPPER_CASE pour les constantes
const MAX_TABS = 100;
const DEFAULT_URL = 'home://newtab';
```

**Hooks personnalisés** :
```javascript
// Toujours commencer par "use"
const useTabNavigation = () => { ... };
const useBookmarks = () => { ... };
```

### Structure des composants

```javascript
import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import useBrowserStore from '../store/browserStore';

/**
 * Description du composant
 * @param {Object} props - Props du composant
 */
const MyComponent = ({ prop1, prop2 }) => {
  // 1. Hooks du store
  const { data, action } = useBrowserStore();
  
  // 2. State local
  const [localState, setLocalState] = useState(initialValue);
  
  // 3. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 4. Handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // 5. Render helpers
  const renderItem = (item) => {
    return <div key={item.id}>{item.name}</div>;
  };
  
  // 6. Render principal
  return (
    <div className="my-component">
      {data.map(renderItem)}
    </div>
  );
};

export default MyComponent;
```

### CSS

**Organisation** :
```css
/* 1. Composant principal */
.my-component {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: 12px;
  margin: 0;
  
  /* Visual */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  
  /* Typography */
  font-size: 14px;
  color: #333;
  
  /* Other */
  cursor: pointer;
  transition: all 0.2s;
}

/* 2. États */
.my-component:hover {
  background: #f8f8f8;
}

.my-component.active {
  border-color: #999;
}

/* 3. Sous-éléments */
.my-component__item {
  padding: 8px;
}
```

**Valeurs** :
- Espacements : Multiples de 4px (4, 8, 12, 16, 20, 24...)
- Border-radius : 4px, 6px, 12px, 24px (rounded)
- Transitions : `0.2s` pour la plupart des interactions

---

## 🔍 Messages de commit

Nous utilisons le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description courte

[Corps optionnel du message]

[Footer optionnel]
```

### Types de commit

| Type | Description | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(tabs): add tab groups support` |
| `fix` | Correction de bug | `fix(navigation): resolve back button issue` |
| `docs` | Documentation | `docs(readme): update installation steps` |
| `style` | Formatting, pas de changement de code | `style(tabs): fix indentation` |
| `refactor` | Refactoring | `refactor(store): simplify state management` |
| `perf` | Amélioration de performance | `perf(tabs): optimize tab switching` |
| `test` | Ajout de tests | `test(navigation): add unit tests` |
| `chore` | Maintenance | `chore(deps): update electron to v28` |

### Exemples

```bash
# Bonne pratique
feat(bookmarks): add bookmark folders
fix(tabs): prevent memory leak on tab close
docs(api): document store methods

# À éviter
update stuff
fix bug
WIP
```

---

## 🧪 Tests

### Tests unitaires

```javascript
// __tests__/TabBar.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import TabBar from '../components/TabBar';

describe('TabBar', () => {
  it('renders tabs correctly', () => {
    render(<TabBar />);
    expect(screen.getByText('New Tab')).toBeInTheDocument();
  });
  
  it('creates new tab on button click', () => {
    render(<TabBar />);
    const button = screen.getByTitle('New Tab');
    fireEvent.click(button);
    // Assertions...
  });
});
```

### Tests E2E

```javascript
// e2e/basic-navigation.spec.js
const { test, expect } = require('@playwright/test');

test('basic navigation flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Click new tab
  await page.click('[title="New Tab"]');
  
  // Enter URL
  await page.fill('.url-bar', 'google.com');
  await page.press('.url-bar', 'Enter');
  
  // Wait for navigation
  await expect(page).toHaveURL(/google\.com/);
});
```

---

## 📋 Pull Request

### Checklist

Avant de soumettre une PR, vérifiez :

- [ ] Le code compile sans erreurs
- [ ] Les tests passent (si applicable)
- [ ] La documentation est à jour
- [ ] Le code suit les conventions du projet
- [ ] Les commits suivent le format conventional
- [ ] Pas de code commenté ou de console.log
- [ ] Les dépendances sont nécessaires
- [ ] La PR a une description claire

### Template de PR

```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Tests
- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests manuels effectués
- [ ] Pas de régression

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Notes supplémentaires
Informations contextuelles utiles
```

### Processus de review

1. **Automated checks** : CI/CD exécute les tests
2. **Code review** : Un mainteneur examine le code
3. **Changements demandés** : Répondre aux commentaires
4. **Approval** : PR approuvée
5. **Merge** : Fusion dans la branche principale

---

## 🐛 Rapport de bugs

### Template d'issue

```markdown
## Description du bug
Description claire et concise

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer

## Comportement actuel
Ce qui se passe réellement

## Screenshots
Si applicable

## Environnement
- OS: [Windows 11, macOS 13, Ubuntu 22.04]
- Version du navigateur: [1.0.0]
- Version d'Electron: [27.1.0]
- Version de Node: [18.17.0]

## Logs
```
Coller les logs pertinents
```

## Informations supplémentaires
Contexte additionnel
```

---

## 💡 Demande de fonctionnalité

### Template

```markdown
## Problème à résoudre
Quel problème cette fonctionnalité résout-elle ?

## Solution proposée
Description de la fonctionnalité souhaitée

## Alternatives considérées
Autres approches envisagées

## Informations supplémentaires
Contexte, mockups, etc.
```

---

## 🔧 Architecture et décisions

### Ajout d'une dépendance

Avant d'ajouter une nouvelle dépendance :
1. Vérifier qu'elle est nécessaire
2. Évaluer la taille du package
3. Vérifier la maintenance (dernière mise à jour, issues)
4. Proposer dans une issue avant d'ajouter

### Modifications de l'architecture

Pour des changements majeurs :
1. Créer une issue "RFC" (Request for Comments)
2. Décrire la proposition en détail
3. Discuter avec les mainteneurs
4. Obtenir un consensus avant d'implémenter

---

## 📚 Ressources utiles

### Documentation

- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [Zustand Guide](https://github.com/pmndrs/zustand)

### Outils de développement

- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Electron DevTools](https://www.electronjs.org/docs/tutorial/devtools-extension)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

### Communauté

- Discord : [Lien du serveur]
- Discussions GitHub : [Lien]
- Twitter : [@VotreCompte]

---

## 🙏 Remerciements

Merci de contribuer au projet ! Chaque contribution, petite ou grande, est appréciée.

### Hall of Fame

Contributors seront listés ici :
- [@contributor1](https://github.com/contributor1) - Feature X
- [@contributor2](https://github.com/contributor2) - Bug fix Y

---

## ❓ Questions

Des questions ? N'hésitez pas à :
- Ouvrir une discussion GitHub
- Rejoindre notre Discord
- Envoyer un email à [email@example.com]

Nous sommes là pour vous aider ! 🚀
