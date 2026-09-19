# Validation de livraison

## Exécuté dans l'environnement de développement

- Installation npm réussie avec lockfile.
- TypeScript strict et build Vite réussis.
- ESLint réussi.
- Vitest : 10 tests réussis (CDF, banque, estimation, incertitude, adaptation, modèles IRT, rapidité/interruption, seed, persistance/restauration/effacement).
- 2800 simulations synthétiques Quick, résultats archivés dans SIMULATION.json.

## Vérification navigateur

Le navigateur cloud ne peut pas ouvrir localhost dans cet environnement (ERR_BLOCKED_BY_CLIENT). Aucun résultat Lighthouse ou validation visuelle manuelle n'est donc inventé.

Le workflow Validate SYNAPTIK exécute des tests Chromium : 360×640, 390×844, 412×915, 768×1024, 1366×768, 1920×1080, absence de débordement à l'accueil/préparation, parcours Quick, démonstrations, pause/rechargement/reprise, résultats, historique, entraînement, rechargement hors ligne et erreurs console. Captures et rapport en artefacts. Leur présence dans le dépôt ne signifie pas qu'ils ont réussi : consulter le statut Actions.

## Non établi

Validation humaine, fidélité clinique, exactitude du QI, normes par âge, équivalence linguistique, audit WCAG complet, test manuel sur Android réel, compatibilité iOS et mesures Lighthouse. Les durées des modes restent indicatives.
