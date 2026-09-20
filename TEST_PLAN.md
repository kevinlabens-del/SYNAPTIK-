# SYNAPTIK — Plan de tests

## Tests minimum après toute modification

Exécuter :

```sh
npm test
npm run lint
npm run build
```

La modification n’est pas validée si l’une de ces commandes échoue.

## Tests navigateur

Pour toute modification du parcours, du stockage, de la PWA, du responsive ou des résultats :

```sh
npm run test:e2e
```

Le navigateur Playwright doit être installé lorsque nécessaire.

## Viewports à préserver

Le parcours E2E doit continuer à couvrir au minimum les tailles déjà documentées :
- 320×568
- 360×640
- 390×844
- 412×915
- 768×1024
- 1366×768
- 1920×1080

## Moteur cognitif

Si `src/cognitive`, `src/exercises` ou les règles de scoring changent :

1. ajouter ou adapter les tests unitaires ;
2. vérifier les invariants de compatibilité ;
3. lancer la simulation appropriée ;
4. archiver les résultats si le modèle change ;
5. documenter les limites ;
6. ne jamais qualifier une simulation de validation humaine.

Commande :

```sh
npm run simulate
```

## Scénarios anti-régression

- [ ] Quick contient le nombre attendu d’items.
- [ ] Standard contient le nombre attendu d’items.
- [ ] Deep contient le nombre attendu d’items.
- [ ] Les six domaines restent couverts.
- [ ] Aucun item exact ne se répète dans une session.
- [ ] Les sous-types restent suffisamment couverts selon la logique de version.
- [ ] Une interruption/reprise ne corrompt pas le score.
- [ ] Les anciennes sessions gardent leur calcul historique.
- [ ] L’entraînement n’altère pas le score.
- [ ] Les démonstrations ne créent pas de réponse évaluée.
- [ ] Le changement de langue ne modifie pas rétroactivement un score terminé.
- [ ] Les tâches de vitesse n’incluent pas le délai de confirmation.
- [ ] une session 1.3 affiche la question sans chrono, masque le stimulus/les choix, puis démarre 8 s après « Je suis prêt » ;
- [ ] une session historique 1.2 conserve sa fenêtre de 12 s ;
- [ ] une session historique 1.1 conserve son comportement antérieur ;
- [ ] la correction détaillée n’est disponible qu’après la fin de l’évaluation ;
- [ ] chaque réponse terminée retrouve son item, sa réponse et la bonne réponse.
- [ ] Les percentiles ne sont pas présentés comme normes observées.
- [ ] Les limites et avertissements restent visibles.

## IndexedDB

- [ ] création session ;
- [ ] sauvegarde après réponse ;
- [ ] restauration ;
- [ ] reprise item courant ;
- [ ] historique ;
- [ ] effacement ;
- [ ] compatibilité avec session ancienne.

## PWA

- [ ] manifest accessible ;
- [ ] icônes accessibles ;
- [ ] service worker enregistré ;
- [ ] cache versionné ;
- [ ] chargement hors ligne ;
- [ ] mise à jour après nouveau build ;
- [ ] mise à jour automatique silencieuse sans bannière ;
- [ ] aucune recharge automatique pendant préparation, démonstration, test ou résultat ;
- [ ] compatibilité du chemin `/SYNAPTIK-/`.

## UI

- [ ] aucun overflow horizontal ;
- [ ] contrôles tactiles utilisables ;
- [ ] contraste suffisant ;
- [ ] `prefers-reduced-motion` respecté ;
- [ ] pas d’indice visuel involontaire sur les réponses ;
- [ ] aucune animation perturbatrice pendant une tâche chronométrée ;
- [ ] identité visuelle conforme à `DESIGN_SYSTEM.md`.

## Validation scientifique

Une CI verte signifie que le logiciel respecte ses tests. Elle ne signifie pas que le score est cliniquement valide.
