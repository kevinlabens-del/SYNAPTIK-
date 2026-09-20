# SYNAPTIK TEST QI — Fonctionnalités

Légende : ✅ fonction présente ; 🧪 présente mais nécessitant toujours validation scientifique ou matérielle ; 🚧 amélioration possible.

| Fonction | Statut | Source principale |
|---|---:|---|
| Interface FR/EN | ✅ | `src/app` |
| Crédit créateur CR3@TIX dans le footer | ✅ | `src/app/App.tsx` |
| Bouton CR3@TIX Soutien flottant, masqué pendant tous les exercices | ✅ | `public/support-button.js` |
| Navigation multipage hash + menu burger | ✅ | `src/app/App.tsx` + styles |
| Responsive mobile renforcé jusqu’à 320 px | ✅ | `src/styles/responsive.css` |
| Six domaines cognitifs | ✅ | `src/cognitive/types.ts` |
| Quick 36 items | ✅ | `src/cognitive/types.ts` |
| Standard 72 items | ✅ | `src/cognitive/types.ts` |
| Deep 120 items | ✅ | `src/cognitive/types.ts` |
| Sélection adaptative | ✅ | `src/cognitive/engine.ts` |
| Modèles 1PL/2PL/3PL supportés | ✅ | moteur |
| Moteur actuel 3PL expérimental | 🧪 | `docs/SCORING.md` |
| Posterior discret / EAP / SE | ✅ | moteur |
| Intervalles postérieurs par domaine v1.1 | ✅ | moteur |
| Percentile théorique | 🧪 | moteur |
| Démonstrations facultatives, séparées du démarrage | ✅ | `src/app` |
| Démarrage direct de l’évaluation après préparation | ✅ | `src/app` |
| Entraînement indépendant | ✅ | `src/app` |
| Tâches de vitesse : lecture libre, bouton « Je suis prêt », puis stimulus chronométré 8 s | ✅ | v1.3 |
| Sauvegarde IndexedDB | ✅ | `src/storage` |
| Reprise de session | ✅ | app + stockage |
| Historique | ✅ | app + stockage |
| Rapport final | ✅ | app |
| Correction détaillée post-test : question, réponse donnée, bonne réponse et explication | ✅ | `src/app/AnswerReview.tsx` |
| Impression du rapport | ✅ | app |
| Export JSON | ✅ | app |
| PWA / service worker | ✅ | `public` + build |
| Mise à jour PWA automatique et silencieuse, avec recharge différée pendant les écrans sensibles | ✅ | `src/main.tsx` + service worker |
| Fonctionnement hors ligne | ✅ | vérifié par e2e selon docs |
| Réseau neuronal visuel | ✅ | `src/app/Neural.tsx` |
| Tests unitaires | ✅ | `tests` |
| Tests E2E multi-viewports | ✅ | `e2e` |
| Simulateur synthétique | ✅ | `src/cognitive/simulate.ts` |
| Calibration humaine | 🚧 | non réalisée |
| Normes par âge | 🚧 | non réalisées |
| Validation clinique | 🚧 | non réalisée |
| Équivalence psychométrique FR/EN | 🚧 | non réalisée |

## Fonctions critiques à ne pas casser

- score dépendant uniquement des réponses d’évaluation ;
- entraînement séparé ;
- reprise locale ;
- compatibilité sessions historiques ;
- séparation mesure/UI ;
- versionnement du modèle ;
- mode hors ligne ;
- FR/EN ;
- avertissements scientifiques.

## Règle de précision

La priorité est d’améliorer les items, la calibration, la couverture et la validation. Ne pas confondre précision d’affichage avec précision réelle de mesure.
