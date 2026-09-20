# SYNAPTIK — Historique des demandes de développement

## 2026-09-20 — Auto-update silencieux de la PWA

### Demande
Remplacer la notification « Mise à jour prête · recharger après votre session » par un système de mise à jour automatique.

### Action
- suppression de la bannière de mise à jour ;
- vérification automatique au lancement, au retour au premier plan et toutes les 30 minutes ;
- activation automatique du nouveau service worker ;
- recharge automatique uniquement sur une page sans risque ;
- aucune recharge forcée pendant préparation, démonstration, évaluation ou lecture du résultat ;
- conservation du fonctionnement hors ligne.

### Test anti-régression
Playwright vérifie l’absence de la bannière et l’exposition de l’état de page utilisé par le système de mise à jour.

---

## 2026-09-20 — Séparation analyse / démonstrations

### Demande
Afficher deux boutons distincts après la sélection du mode : un pour démarrer réellement l’analyse et un pour consulter les trois exercices de démonstration.

### Action
- « Démarrer l’analyse » crée immédiatement la session et lance le test sélectionné.
- « Voir les 3 exercices de démonstration » ouvre uniquement les exercices non notés.
- Après la troisième démonstration, retour à la page de préparation au lieu de démarrer automatiquement l’évaluation.
- Le test E2E vérifie désormais les deux parcours.

### Résultat
Les démonstrations deviennent réellement facultatives et restent séparées de l’évaluation notée.

---

## 2026-09-20 — Correction du test E2E de langue

### Incident
Les builds, tests unitaires et le déploiement Pages réussissaient, mais la validation navigateur échouait car Playwright cherchait encore le libellé accessible « Language » après sa traduction en « Langue ».

### Correction
Le test cible désormais le sélecteur de langue du header sans dépendre de son texte localisé.

### Résultat attendu
La validation complète doit pouvoir repasser au vert sans modifier le comportement de l’application.

---

## 2026-09-20 — Correction des textes anglais en mode français

### Demande
Remplacer les textes anglais encore visibles lorsque l’application est réglée sur FR.

### Action
Traduction du titre d’accueil, CTA, sous-titre de marque, cartographie neuronale, actions des domaines, modes, appareils, démonstration, résultats, historique, entraînement, méthodologie, réseau cognitif et sous-types affichés. Le mode EN reste disponible.

### Test anti-régression
Le parcours Playwright utilise désormais les principaux libellés français.

### Résultat
Correction intégrée au dépôt et validation CI déclenchée par les pushes.

---

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
