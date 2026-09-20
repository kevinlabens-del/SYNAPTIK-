# Architecture

- `src/cognitive/types.ts` : contrat versionné des items, réponses et sessions.
- `src/cognitive/engine.ts` : probabilité 1PL/2PL/3PL, posterior discret, information de Fisher, sélection, normalisation et rapports. Aucun import React ou accès navigateur.
- `src/exercises/bank.ts` : générateur déterministe, langues explicites, six domaines, 60 variantes par domaine.
- `src/storage/store.ts` : interface asynchrone IndexedDB, transactions confirmées à la fin, compatible avec un futur adaptateur serveur volontaire.
- `src/app` : parcours, rendu des exercices, i18n, réseau SVG.
- `src/styles` : tokens, reset, typographie, réseau, animations, layout et responsive séparés.
- `public` : manifeste, icônes et service worker.
- `scripts/cache-assets.mjs` : précache des bundles compilés et empreinte de version.
- `tests` : invariants moteur et stockage.
- `e2e` : parcours complet et tailles de viewport.

Le score dépend exclusivement des réponses d'évaluation. L'entraînement ne crée pas de session. La démonstration précède la création de session. Chaque réponse finalisée déclenche une transaction IndexedDB ; la question courante est enregistrée. La sauvegarde n'est pas un serveur ni une sauvegarde cloud.

Une reprise signale l'item comme interrompu ; une séquence de mémoire déjà présentée n'est pas réaffichée. La mesure de durée utilise performance.now() pour la tentative affichée, pas le temps passé application fermée. Les changements d'onglet sont enregistrés. Le score n'utilise pas le temps total hors domaine vitesse.

Les vues restent des états React sans dépendance de routeur externe, mais la navigation est synchronisée avec des routes hash compatibles GitHub Pages : `#/exploration`, `#/preparation`, `#/demonstration`, `#/analyse`, `#/resultat`, `#/resultats`, `#/entrainement`, `#/methodologie`. Le bouton retour/avant du navigateur fonctionne via `hashchange`. Une route `#/analyse` restaurée après rechargement tente de reprendre la session active depuis IndexedDB ; une route `#/resultat` sans session en mémoire recharge la session terminée la plus récente. Le menu burger est la navigation principale des pages publiques.

Le panneau de développement inclut un simulateur de 1 à 5 000 sessions exécuté dans un Web Worker, avec capacité réglable de -3 à +3, moyenne retrouvée, RMSE et histogramme. Le composant et le worker sont éliminés du build de production.
