# Cyclo-Score

Ce projet est une application web permettant de calculer un "Cyclo-Score", inspirée par le travail réalisé sur [Altis Play](https://altisplay.fr/cyclo-score/). Basé sur le **[Nuxt UI Docs Template](https://github.com/nuxt-ui-templates/docs)**, il fournit une interface interactive pour évaluer la cyclabilité d'une ville ou d'un aménagement, accompagnée d'un glossaire complet.

## ✨ Fonctionnalités Clés

- 🧮 **Calculateur Interactif** : Un questionnaire dynamique pour déterminer le score de cyclabilité.
- 🗺️ **Visualisation Flowchart** : Une vue graphique et interactive de l'arbre de décision (via Vue Flow).
- 📖 **Glossaire Intégré** : Définitions accessibles via des tooltips contextuels et des pages dédiées.
- 🌗 **Mode Sombre/Clair** : Support natif et automatique grâce à Nuxt UI.
- 📱 **Responsive Design** : Interface adaptée aux mobiles et aux bureaux.

## 🛠️ Stack Technique

Ce projet utilise les dernières technologies de l'écosystème Vue et Nuxt :

- 🏗️ **Framework** : [Nuxt 4](https://nuxt.com/) (Dernière version) pour des performances optimales.
- 🎨 **UI & Styling** : [Nuxt UI](https://ui.nuxt.com/) (basé sur Tailwind CSS) pour un design système cohérent et moderne.
- 📝 **Contenu** : [Nuxt Content](https://content.nuxt.com/) pour la gestion du glossaire et de la documentation en Markdown.
- 📊 **Visualisation** : [Vue Flow](https://vueflow.dev/) (Core, Controls, Background) pour l'affichage de diagrammes interactifs.
- ✨ **Icônes** : [Nuxt Icon](https://nuxt.com/modules/icon) intégrant les collections `lucide` et `simple-icons`.
- 🖼️ **Images & SEO** : [Nuxt Image](https://image.nuxt.com/) et [Nuxt OG Image](https://nuxt.com/modules/og-image) pour l'optimisation des médias et le partage social.
- 📐 **Algorithmes** : [Dagre](https://github.com/dagrejs/dagre) pour le calcul automatique du layout des graphes.

## 📂 Structure du Projet

Voici un aperçu de l'organisation des fichiers :

```bash
cyclo-score/
├── app/
│   ├── assets/          # Styles globaux (CSS) et icônes
│   ├── components/      # Composants Vue réutilisables (CycloQuestion, etc.)
│   ├── composables/     # Logique partagée (hooks)
│   ├── layouts/         # Mises en page (Header, Footer)
│   ├── pages/           # Routes de l'application (index, calculateur, flowchart)
│   ├── utils/           # Utilitaires et logique métier (questions.ts)
│   ├── app.config.ts    # Configuration de l'interface (couleurs, icônes)
│   └── app.vue          # Point d'entrée de l'application
├── content/             # Fichiers Markdown pour le contenu
│   ├── glossaire/       # Définitions des termes
│   └── questions/       # Contenu détaillé des questions
├── server/              # API et routes serveur (si nécessaire)
├── nuxt.config.ts       # Configuration principale de Nuxt
└── package.json         # Dépendances et scripts
```

## 🚀 Installation et Démarrage

Pour faire tourner le projet en local, assurez-vous d'avoir un gestionnaire de paquets installé (nous recommandons **Bun** ou **pnpm**).

### 1. Cloner le dépôt

```bash
git clone <votre-repo-url>
cd cyclo-score
```

### 2. Installer les dépendances

```bash
bun install
# ou
npm install
# ou
pnpm install
```

### 3. Lancer le serveur de développement

```bash
bun dev
# ou
npm run dev
# ou
pnpm dev
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 📦 Build pour la Production

Pour créer une version optimisée pour la production :

```bash
bun run build
```

Vous pouvez ensuite prévisualiser le build localement avec :

```bash
bun run preview
```

## 🔐 Configuration du Provider GitHub (Nuxt Studio)

Ce projet utilise **Nuxt Studio** pour l'édition de contenu. Pour configurer le provider GitHub, suivez ces étapes :

### Créer une application GitHub OAuth

Allez dans les [GitHub Developer Settings](https://github.com/settings/developers) et créez une nouvelle OAuth App avec :

- **Application name** : Le nom de votre application
- **Homepage URL** : `https://yourdomain.com` (ou `http://localhost:3000` pour le développement)
- **Authorization callback URL** : `https://yourdomain.com/__nuxt_studio/auth/github` (ou `http://localhost:3000/__nuxt_studio/auth/github` pour le développement)

### Configurer les variables d'environnement

Après avoir créé l'application OAuth, vous obtiendrez un **Client ID** et un **Client Secret**. Ajoutez toutes les variables suivantes à votre fichier `.env` en copiant le fichier `.env.example` :

```bash
# Configuration du repository Nuxt Studio
STUDIO_PROVIDER=github
STUDIO_OWNER=votre-nom-dutilisateur-github
STUDIO_REPO=nom-de-votre-repository
STUDIO_BRANCH=main  # optionnel, par défaut : main

# Authentification GitHub OAuth
STUDIO_GITHUB_CLIENT_ID=votre_github_client_id
STUDIO_GITHUB_CLIENT_SECRET=votre_github_client_secret

```

Les utilisateurs pourront alors s'authentifier via GitHub et auront un accès automatique au repository pour pousser leurs modifications.

### Documentation complémentaire

Pour plus d'informations sur la configuration des providers d'authentification avec Nuxt Studio, consultez la documentation officielle :

👉 **[Documentation Nuxt Studio - Auth Providers](https://nuxt.studio/auth-providers)**

Cette documentation couvre tous les providers disponibles (GitHub, GitLab, etc.) avec des exemples détaillés de configuration.
## 📱 Contact

Vous pouvez contacter l'auteur du projet sur [GitHub](https://github.com/alexisdechiara) ou via [son site web](https://alexisdechiara.fr)

## 🧾 Licences

Ce projet est sous licence MIT, vous êtes libre de le modifier, le redistribuer et le publier comme vous le souhaitez. Vous pouvez le trouver dans le fichier [LICENSE](LICENSE).
