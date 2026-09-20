# Validation de livraison

## Exécuté dans l'environnement de développement

- Installation npm réussie avec lockfile.
- TypeScript strict et build Vite réussis.
- ESLint réussi.
- Vitest : 11 tests réussis (CDF, banque, estimation, incertitude, adaptation, modèles IRT, rapidité/interruption, seed, persistance/restauration/effacement).
- 2800 simulations synthétiques Quick, résultats archivés dans SIMULATION.json.

## Vérification navigateur

Le navigateur cloud ne peut pas ouvrir localhost dans cet environnement (ERR_BLOCKED_BY_CLIENT). La vérification a été transférée à GitHub Actions. Aucun résultat Lighthouse n’est inventé.

Le workflow Validate SYNAPTIK exécute des tests Chromium : 360×640, 390×844, 412×915, 768×1024, 1366×768, 1920×1080, absence de débordement à l'accueil/préparation, parcours Quick, démonstrations, pause/rechargement/reprise, résultats, historique, entraînement, rechargement hors ligne et erreurs console. Captures et rapport en artefacts. Leur présence dans le dépôt ne signifie pas qu'ils ont réussi : consulter le statut Actions.

## Non établi

Validation humaine, fidélité clinique, exactitude du QI, normes par âge, équivalence linguistique, audit WCAG complet, test manuel sur Android réel, compatibilité iOS et mesures Lighthouse. Les durées des modes restent indicatives.

## Exécution GitHub confirmée

Run `35446755812`, commit `c9088c7` : **réussi**. Les 7 tests Chromium passent, dont les six tailles et le parcours complet avec rechargement hors ligne. Installation, ESLint, 11 tests unitaires et build réussis. Artefacts : browser-validation et synaptik-dist.

## Dernière version publiée

Commit applicatif `81802158591e1a17779531f4da3cc9912925abd9` : validation réussie dans le run `35446921216`. Les résultats sont aussi vérifiés aux six tailles ; le changement de langue conserve le score. Déploiement GitHub Pages réussi dans le run `35446998045`.

URL vérifiée : https://kevinlabens-del.github.io/SYNAPTIK-/

Inspection du site publié : capture de l'accueil desktop, ouverture de la préparation, contenu et bouton d'installation visibles. Aucune erreur JavaScript de l'application observée ; des erreurs du script d'extension du navigateur de contrôle ont été distinguées de celles de l'application. Les captures mobiles sont produites par la CI ; aucun essai sur téléphone Android physique ni résultat Lighthouse n'est revendiqué.

Audit final de répétition : 12 tests unitaires passent après ajout d'une vérification des 312 exercices distincts et des 120 sélections Deep sans répétition exacte. Les temps par domaine incluent un coefficient de variation descriptif.


## Version 1.1 regression checks
Added tests for interrupted-answer exclusion, asymmetric posterior quantiles, medium-difficulty starts, subtype coverage and legacy interval compatibility. Browser flow includes the new speed readiness screen. Existing synthetic results describe the earlier selector; they must not be used to validate version 1.1 or human measurement accuracy.

The new selector is simulated separately in `SIMULATION-1.1.json` (2,800 synthetic Quick sessions). This is model recovery under assumed parameters, not an empirical accuracy comparison. Browser regression waits longer than the deadline on the readiness screen and checks that confirmation delay is excluded from stored speed duration.


## Version 1.2 regression checks

Browser regression now includes a 320×568 viewport, verifies the 12-second speed window after an untimed instruction screen, checks that completed Quick sessions expose 36 post-test review entries, and continues to test offline reload and session persistence. Version 1.2 retains version 1.1 posterior/exclusion logic; legacy version 1 sessions retain their historical interval behavior.
