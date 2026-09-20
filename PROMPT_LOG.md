# SYNAPTIK TEST QI — Historique des demandes de développement

## 2026-09-20 — Correction réelle du masquage Shadow DOM

### Cause
Le composant Soutien applique `:host { all: initial; }`. Cette réinitialisation pouvait neutraliser le comportement visuel de l’attribut HTML `hidden`.

### Correction
- règle explicite `:host([hidden]), :host([aria-hidden="true"])` avec `display:none !important` ;
- événements pointeur désactivés pendant le masquage ;
- état initial calculé avant l’affichage du composant pour éviter un flash pendant un exercice.

---

## 2026-09-20 — Correction du test Shadow DOM du bouton Soutien

### Incident
La première validation de la protection des exercices a échoué car Playwright testait la visibilité géométrique du conteneur Shadow DOM, qui n’a pas de dimensions propres même lorsque son lien flottant est visible.

### Correction
Le test vérifie désormais l’attribut `aria-hidden` du conteneur et la visibilité réelle du lien « Soutenir » dans le Shadow DOM.

---

## 2026-09-20 — Protection du bouton Soutien pendant les exercices

### Demande
S’assurer que le bouton CR3@TIX Soutien n’interfère jamais avec les exercices.

### Action
- bouton masqué sur Démonstration, Analyse et Entraînement ;
- retrait du focus clavier lorsqu’il est masqué ;
- détection basée sur l’état de page SYNAPTIK avec garde supplémentaire sur la présence d’un exercice ;
- réapparition automatique dès le retour sur une page non-exercice ;
- tests Playwright sur les trois parcours.

---

## 2026-09-20 — Bouton CR3@TIX Soutien

### Demande
Ajouter à SYNAPTIK TEST QI le bouton de soutien déjà utilisé par l’application CR3@TIX Soutien.

### Action
- reprise du composant officiel « ❤ Soutenir » ;
- lien vers `https://kevinlabens-del.github.io/CR3-TIX-SOUTIEN-/` ;
- ouverture sécurisée dans un nouvel onglet ;
- intégration via Shadow DOM pour éviter les conflits CSS ;
- ajout au précache de la PWA ;
- test Playwright du bouton et de son lien.

---

## 2026-09-20 — Mention « Créé par CR3@TIX »

### Demande
Ajouter en bas de l’application une mention indiquant que SYNAPTIK TEST QI a été créé par la marque CR3@TIX.

### Action
- ajout du crédit dans le footer sur toutes les pages ;
- version française : « Créé par CR3@TIX » ;
- version anglaise : « Created by CR3@TIX » ;
- style discret cohérent avec l’identité visuelle ;
- ajout d’un test navigateur pour éviter sa disparition lors d’une future modification.

---

## 2026-09-20 — Correction du cache après déploiement

### Incident
GitHub Pages avait publié le bon artefact, mais un appareil pouvait continuer à afficher une ancienne interface depuis le cache du service worker.

### Vérification
L’artefact réellement déployé contient bien le nom « SYNAPTIK TEST QI », le menu burger et les routes multipages.

### Correction
- navigation réseau d’abord quand une connexion est disponible ;
- repli sur le cache uniquement hors ligne ou en cas d’échec réseau ;
- mise à jour du service worker avec `updateViaCache: "none"` ;
- nouvelle vérification au retour en ligne et lors du retour sur la page.

---

## 2026-09-20 — Renommage en SYNAPTIK TEST QI

### Demande
Remplacer le nom public SYNAPTIK par SYNAPTIK TEST QI.

### Action
- nom visible de l’application remplacé ;
- titre navigateur mis à jour ;
- manifeste PWA `name` et `short_name` mis à jour ;
- métadonnées HTML harmonisées ;
- documentation d’identité mise à jour ;
- dépôt GitHub conservé sous son nom actuel pour ne pas casser les liens.

---

## 2026-09-20 — Navigation multipage et menu burger

### Demande
Remplacer la barre d’onglets horizontale par un menu burger et transformer SYNAPTIK en application multipage.

### Action
Suppression des onglets, ajout d’un menu burger responsive, routes distinctes compatibles GitHub Pages, prise en charge du retour/avant navigateur et restauration de la session active lors d’un rechargement sur l’analyse.

### Test anti-régression
Playwright vérifie le menu, les URL distinctes, le retour navigateur, le responsive et le rechargement hors ligne d’une page routée.

---

## 2026-09-20 — Chrono Vitesse 8 s après « Je suis prêt »

### Demande
Conserver les 8 secondes des exercices de vitesse, mais permettre de lire la question avant que le temps ne démarre.

### Action
- nouvelles sessions en version 1.3 ;
- question/consigne affichée sans chronomètre ;
- aucun stimulus chronométré ni choix visible pendant cette phase ;
- bouton « Je suis prêt » ;
- apparition du stimulus et démarrage des 8 secondes uniquement après ce bouton ;
- sessions 1.2 conservées à 12 secondes pour compatibilité historique.

### Objectif de mesure
Réduire la contamination du temps de réponse par la lecture de la consigne, sans allonger artificiellement la fenêtre de résolution.

---

## 2026-09-20 — Responsive mobile, chrono vitesse et correction détaillée

### Demande
Améliorer l’adaptation aux écrans mobiles, éviter que certaines questions chronométrées expirent avant une lecture confortable et permettre de revoir toutes les erreurs après le test.

### Action
- responsive renforcé jusqu’à 320 px ;
- modes, résultats, matrices, visuels, boutons et correction adaptés aux petits écrans ;
- nouvelles sessions en version 1.2 ;
- consigne des tâches Vitesse lisible sans chrono ;
- fenêtre de réponse Vitesse portée à 12 secondes après démarrage explicite ;
- ancienne logique préservée pour les sessions 1.1 ;
- ajout d’une correction détaillée uniquement après la fin du test ;
- chaque réponse indique la question, la réponse choisie, la bonne réponse, l’explication et le temps.

### Sécurité psychométrique
Les bonnes réponses restent invisibles pendant l’évaluation. Le changement de temps est versionné pour ne pas réinterpréter silencieusement les anciennes sessions.

---

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
