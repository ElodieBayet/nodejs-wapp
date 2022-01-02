# Node.js Wapp :: Exemple de développement avec Node.js

Date | Reviewed | Purpose | Discipline | Example
---- | -------- | ------- | ---------- | -------
2020.01 | 2021.10 | Pedagogy | JavaScript | [MusicalEras](https://musicaleras.herokuapp.com/)


## **Avant-propos**

Le but n'est pas de fournir publiquement un _modèle_ ou un _template_ intégrable, mais bien de montrer **comment développer quelque chose de similaire** en se servant de ce projet comme exemple de départ. Il n'y aura pas de _versions ultérieures_, ce projet ne va pas _évoluer_ – sauf corrections bugs, erreurs, coquilles laissés par mégarde.

---

## Sommaire 
0. [0 - Présentation](#0---presentation)
    * [0.0 - Objectifs](#0.0---objectifs)
    * [0.1 - Évolution](#0.1---evolution)
    * [0.2 - Utilisation](#0.3---utilisation)
1. [1 - Démarrage](#1---demarrage)
    * [1.0 - Prérequis](#1.0---prerequis)
    * [1.1 - Installation](#1.1---installation)
    * [1.2 - Configuration](#1.2---configuration)
2. [2 - Structure](#2---structure)
    * [2.0 - Architecture SEO](#2.0---architecture-seo)
    * [2.1 - Dossiers et fichiers](#2.1---dossiers-et-fichiers)
    * [2.2 - Base de données](#2.2---base-de-donnees)
3. [3 - Méthodologie](#3---methodologie)
    * [3.0 - Développement](#3.0---developpement)
    * [3.1 - Partie Asynchrone](#3.1---partie-asynchrone)
4. [4 - Remarques](#4---remarques)

---

## 0 - Présentation

Exemple de développement d'une application web avec **Node.js / JavaScript / MongoDB**. 


### 0.0 - Objectifs

- Découvrir la conception d'une application web basique avec **Node.js**
- Idendifier les tâches qui incombent au Back-End *– notamment le travail du serveur pour chaque requête*
- Introduire la communication désynchronisée _Back-End / Front-End_


### 0.1 - Contenu

La thématique est celle de la **Musique occidentale savante**. Il s'agit d'un portail d'aperçu des périodes musicales qui se sont succédées à travers les âges. Chaque période répertorie également quelques compositeurs et compositrices emblématiques.

Cette application étant une simple démonstration de développement, elle n'a pas pour vocation de présenter un contenu absolument complet, et peut se montrer très approximative sur certains points. La source principale *– et unique –* des informations présentées n'est autre que la page **[Wikipédia : Chronologie de la musique classique occidentale](https://fr.wikipedia.org/wiki/Chronologie_de_la_musique_classique_occidentale)**.


### 0.2 - Évolution

Sauf un quelconque défaut laissé par mégarde, ce projet ne doit pas évoluer vers une modélisation plus avancée. Il constitue **une ressource pédagogique** de base destinée à l'apprentissage de concepts parfois obscurs pour des néophytes.


### 0.3 - Utilisation

Ce projet n'est utilisable que dans un cadre d'apprentissage individuel et privé. Il ne convient pas pour une utilisation publique ou professionnelle.

#### Images

Certaines images employées dans ce projet – sauf celles listées dans **"Exceptions"** – sont soumises aux droits d'auteur et protégées par la [Sofam](https://www.sofam.be/) – auteure n° 72/55. Aucune reproduction, communication publique, réutilisation partielle ou entière des images **n'est autorisée**.

#### Exceptions

* les images des compositeur.rice.s qui trouvent leurs origines sur leurs pages Wikipédia respectives
* les logos des technologies employés sur la page _Informations_.

---

## 1 - Démarrage

Le projet requiert divers éléments et une certaine configuration pour fonctionner.


### 1.0 - Prérequis

* L'environnement et gestionnaire de packages **[Node.js / NPM](https://nodejs.org/en/download/)**
* Un système de gestion de bases de données documents tel que **MongoDB**, et un outil d'administration tels que **[Compass](https://www.mongodb.com/products/compass)**
* L'utilitaire **[debug](https://www.npmjs.com/package/debug)** a installer globalement `npm install debug -g`

### 1.1 - Installation

La commande suivante installera les dépendances locales et celles liées au développement :
```sh
npm install
```

#### Dépendances générales

* **async** : ^3.2.1
* **compression** : ^1.7.4
* **express** : ^4.17.1
* **helmet** : ^4.6.0
* **mongoose** : ^6.0.12
* **pug** : ^3.0.2

#### Dépendances de développement

* **env-cmd** : ^10.1.0
* **nodemon** : ^2.0.12


### 1.2 - Configuration

#### Les variables d'environnement

Un fichier `.env.dev` pour le mode 'development', à la racine du dossier, dans lequel il faut inclure les déclarations suivantes :
```
NODE_ENV=development
DEBUG=server,app,async,main,period,compositor
```

Un autre fichier `.env` pour le mode 'production', à la racine du dossier, avec les déclarations suivantes :
```
NODE_ENV=production
DEBUG=false
MONGODB_URI=<vos-identifiants-mot-de-passe-information-server-nom-de-base-de-donnée---fourni-par-MongoDB>
```

Ces fichiers sont chargés par le CLI `env-cmd` selon le mode de démarrage désiré : `npm run prod`, `npm run debug` ou `npm run dev`.

#### La base de données

Les fichiers `data/compositors.json` et `data/periods.json` permettent de créer deux collections éponymes dans une nouvelle base de données MongoDB. Le nom de cette base n'a pas d'importance, car il faudra mettre à jour la ligne suivante dans le fichier `core/app.js`.
```js
const DEVDB_URI = "mongodb://localhost:27017/MusicalEras";
```

---

## 2 - Structure

Une structure spécifique est établie pour chaque partie, laquelle est utile à découvrir pour mieux comprendre le projet et sa résolution.


### 2.0 - Architecture SEO

Afin de présenter des urls propre, ce sont des clés `tag` qui sont employées pour identifier chaque document dans chaque collection. Les `objectId` sont toutefois exploités pour permettre une relation entre documents.

#### URIs

* Accueil :: `/`
* Périodes :: `/period`
    - Détail d'une période :: `./:tag`
* Compositeurs :: `/compositor`
    - Détail d'un.e compositeur.rice :: `./:tag`
* Informations :: `/info`

#### Schéma

![Diagram of website structure](/assets/architecture_seo.jpg)


### 1.1 - Dossiers et fichiers

* `assets/` images, icônes, logos, etc.
* `core/` code source métier de l'application
    - `controllers/` middlewares récepteurs
    - `models/` schéma mongoose d'interaction avec MongoDB
    - `routes/` définitions des routes disponibles et des associations avec leurs contrôleur respectifs
    - `views/` templates en Pug
        - `components/` mixins
        - `contents/` contenu des pages
        - `layout.pug`
    - `app.js` gestion globale de l'application
* `data/` fichiers json à uploader dans MongoDB
    - `compositors.json`
    - `periods.json`
* `public/` code source frontend
* `_manifest.json` en guise d'exemple (optionnel), à préfixer avec le nom de l'application
* `nodemon.json` configuration basique de nodemon
* `server.js` point de démarrage de l'application et d'entrée des requêtes


### 1.2 - Base de données

Pour chaque collection, l'attribut sert à afficher une URL propre au lieu de la donnée alpha-numérique _(moche)_ issue de `objectId`. Ces schémas fonctionnent par association `One-to-Many` de sorte que 'Period-to-Compositor'.

#### Entités

```js
CompositorSchema {
    tag: {type: String, required: true, unique: true, lowercase: true},
    lastname: {type: String, required: true, minLength: 3, maxLength: 128, uppercase: true},
    firstname: {type: String, required: true, minLength: 3, maxLength: 128},
    birth: {type: Date, required: true},
    death: {type: Date},
    origin: {type: String, maxLength: 128},
    figure: {type: String, default: '/fig/default_portrait.jpg'},
    period: [{type: Schema.Types.ObjectId, ref: 'Period'}]
    // - -
    virtuals {
        name: {type: String, return : `${firstname} ${lastname}` },
        life: {type: String, return: `± ${death}-${birth} ans` },
        timelapse: {type: String, return: `de ${birth} à ${death}` }
    }
}
```

```js
PeriodSchema {
    tag: {type: String, required: true, unique: true, lowercase: true},
    name: {type: String, required: true, minLength: 3, maxLength: 128},
    begin: {type: Number, required: true, min: 1, max: 2100},
    end: {type: Number, required: true, min: 1, max: 2100},
    description: {type: String, maxLength: 500}
    // - -
    virtuals {
        delay: {type: Number, return: `${end}-${begin}`},
        duration: {type: String, return: `± ${end}-${begin} ans` },
        timelapse: {type: String, return: `de ${begin} à ${end}` }
    }
}
```

#### Relations

![Diagram of relations](/assets/relational_diagram.jpg)

---

## 3 - Méthodologie

Cet exemple répond à un fonctionnement basique de traitements Back-End en **Node.js**. Le principe est donc de capter des requêtes, d'analyser leurs destinations, d'exploiter le traitement associé, et de construire une réponse.

Dans cet exemple, certains traitements ont été volontairement écarté sans quoi ce projet serait beaucoup trop volumineux. Entre autres, les traitements suivants :
* Les insertions, modifications ou suppressions de données
* L'authentification
* Les autres formats de réponse tels que le JSon ou l'XML
* Le contrôle de formulaire (aucun n'est d'ailleurs présent)


### 3.0 - Développement

Étant plus nombreuses, toutes les requêtes qui commencent par `/period` ou `/compositor` sont canalisées par leurs routeurs respectifs – cf. dossier **core/router/**. Lesquels pourraient ainsi accueillir la gestion des requêtes d'insertion (_Create_), de modification (_Update_) et de suppression (_Delete_) de données si l'application devait grandir. 

Les deux autres requêtes – la racine `/` et `/info` – étant singulières, elles sont canalisées par le même router **main.js** et prise en charge par le même fichier controlleur – **mainController.js**. 


#### 3.1 - Partie asynchrone

Habituellement, on utilise Node.js pour développer des **API** et _toutes_ les requêtes vers Node.js sont _désynchronisées_ – souvent au moyen d'un framework Front-End tel que **Vue.js** ou **React**. Ici, cette application renvoie une version transcompilée de HTML. Aussi pour l'inforgraphie en page d'accueil, le format de réponse des données est en HTML brut. Une route spéciale a donc été créée pour cette gestion : `/async` – choix totalement arbitraire. 

En considérant l'application par son côté Front-End, on s'apperçoit que la page HTML est déjà construite. Seul une portion de _(hyper)texte_ avec le résultat des données est attendu pour générer l'affichage de la liste des compositeur.rice.s. À sa réception, le JavaScript côté client se charge de l'intégration dynamique dans le DOM.

Il y a toutefois une subtilité qui mérite attention : chaque requête asynchrone destinée à récupérer les données **n'est envoyée qu'une seule fois**. Ce, indépendamment du nombre de fois où l'événement de survol est déclanché. Ce qui limite justement la quantité de données chargés : inutile de les charger plusieurs fois si elles sont déjà là ; ET si l'application a très peu de chance de voir ses données mises-à-jour le temps d'une consultation. 

---

## 4 - Remarques

* **Base de données MongoDB** : Un amalgame est souvent fait avec MySQL – ou autres systèmes en SQL –, résultant une incompréhension sur **le contrôle d'intégrité des données**. Avec MongoDB / Node.js, ce sont les schémas _Mongoose_ codés dans Node.js – cf. dossier **core/model/** – qui assurent l'intérité de la base de données – surtout lors d'insertions et de modifications. MongoDB lui-même ne _contrôle_ pratiquement _rien_. On peut très bien ajouter un nouveau _document_ dans une _Collection_ dont la structure n'a rien avoir avec les schémas établi dans Node.js. Chose qui n'est pas possible avec une base de données SQL.
