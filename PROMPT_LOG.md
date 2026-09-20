# SYNAPTIK — Historique des demandes de développement

Ce journal commence avec l’adoption du protocole de développement assisté par IA. Les demandes antérieures restent documentées par l’historique Git et les fichiers techniques existants.

## 2026-09-20 — Intégration de l’icône SVG SYNAPTIK

### Demande
Créer une icône SVG originale pour SYNAPTIK et l’intégrer directement au dépôt.

### Action
- ajout de `public/icon.svg` ;
- ajout du favicon SVG dans `index.html` ;
- déclaration du SVG dans `public/manifest.webmanifest` tout en conservant les PNG existants ;
- ajout du SVG au précache de `public/sw.js`.

### Sécurité / compatibilité
Aucun changement du moteur cognitif, du scoring, du stockage ou des sessions. Les icônes PNG restent présentes pour la compatibilité PWA et maskable.

### Résultat
Intégration effectuée dans le dépôt ; validation CI déclenchée par le push.

---

## 2026-09-20 — Adoption du protocole CR3@TIX adapté à SYNAPTIK

### Demande
Intégrer au projet une méthode de développement persistante : mémoire du projet, règles IA, état, historique des demandes, design system, règles anti-bugs, fonctionnalités et plan de tests.

### Action
Ajout de fichiers de gouvernance adaptés au code, à l’architecture et aux contraintes psychométriques réelles de SYNAPTIK.

### Principe
Ne pas appliquer un modèle générique. Les règles ont été adaptées au moteur IRT expérimental, à la compatibilité des sessions, au stockage local-first, au déploiement GitHub Pages et à l’identité visuelle existante.

### Code applicatif modifié
Aucun.

### Résultat
Protocole installé dans le dépôt.

---
