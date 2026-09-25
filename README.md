# Les Productions du Chauve

Site vitrine du studio de Yves De Roeck : production, enregistrement, mixage, mastering et
sonorisation live. Site statique Astro, édité par Yves avec Pages CMS, hébergé sur Netlify.

En ligne : https://lesproductionsduchauve.netlify.app

## Lancer le site en local

### 1. Installer les outils (une seule fois)

- [Git](https://git-scm.com/downloads)
- [Node.js 24](https://nodejs.org/) (la version est fixée dans `.nvmrc`). Avec
  [nvm](https://github.com/nvm-sh/nvm) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) :
  `nvm install 24` puis `nvm use 24`.

Vérifier :

```bash
node --version   # v24.x
npm --version    # 11.x ou plus
```

### 2. Récupérer le projet et installer les dépendances

```bash
git clone <adresse-du-dépôt>
cd lesproductionsduchauve
npm ci
```

### 3. Démarrer

```bash
npm run dev
```

Ouvrir http://localhost:4321. Chaque modification de code ou de contenu s'affiche aussitôt.
Les brouillons sont visibles en local, avec un badge "Brouillon".

Si la page affiche un ancien contenu, arrêter le serveur (`Ctrl+C`) et relancer avec
`npm run dev -- --force`.

### 4. Voir le site comme en production

```bash
npm run build
npm run preview
```

Ouvrir http://localhost:4321. Les brouillons n'y sont plus.

## Commandes

| Commande               | Rôle                                                 |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Serveur local avec rechargement, brouillons visibles |
| `npm run build`        | Build de production dans `dist/`                     |
| `npm run preview`      | Sert `dist/` en local                                |
| `npm test`             | Tests unitaires (Vitest)                             |
| `npm run check`        | Types et schémas de contenu                          |
| `npm run format`       | Formate le code (Prettier)                           |
| `npm run format:check` | Vérifie le formatage, comme la CI                    |
| `npm run brand`        | Régénère logo, favicon et image de partage           |

Avant de pousser, lancer ce que lance la CI :

```bash
npm run format:check && npm test && npm run check && npm run build
```

## Mesurer les performances

Sur le site en ligne : coller l'adresse d'une page dans https://pagespeed.web.dev.
Objectif : 95 ou plus partout, sur mobile comme sur ordinateur.

En local : `npm run build && npm run preview`, ouvrir la page dans Chrome, puis DevTools
(`F12`) > onglet **Lighthouse** > **Analyze page load**.

## Tester Pages CMS sur une branche

Sur https://app.pagescms.org, ouvrir le dépôt et choisir la branche dans le sélecteur en
haut. Les enregistrements sont alors commités sur cette branche, et Netlify en construit un
aperçu si une pull request est ouverte.

## Déploiement

Netlify construit `main` en production et chaque pull request en Deploy Preview
(`netlify.toml`). Un contenu invalide fait échouer le build avec un message en français, le
site en ligne reste inchangé.

## Changer le logo

1. Remplacer `src/assets/brand/logo-source.png` par le nouveau fichier, sous le même nom :
   PNG carré, fond transparent, 1000 px ou plus de côté si possible.
2. Lancer `npm run brand`.
3. Vérifier avec `npm run dev`, puis commiter.

La commande régénère `src/assets/brand/logo.png` (en-tête, page 404), `public/favicon.png`,
`public/apple-touch-icon.png` et `public/og-default.jpg` (image de partage). Elle
n'agrandit jamais le logo au-delà de sa taille réelle.

## Documentation

| Fichier                             | Contenu                                           |
| ----------------------------------- | ------------------------------------------------- |
| `docs/adr/001-site-architecture.md` | Architecture, modèle de contenu, choix et raisons |
| `CLAUDE.md`                         | Règles de code                                    |
| `docs/guide-yves.md`                | Guide d'édition pour Yves                         |
| `docs/backlog/`                     | Idées pour plus tard                              |
