# SYNAPTIK TEST QI — État actuel du projet

**Dernière mise à jour protocole :** 2026-09-20  
**Branche principale :** main  
**Version package :** 1.0.0  
**Version de mesure des nouvelles sessions :** 1.3  
**Statut :** application fonctionnelle et publiée ; mesure encore expérimentale

## Ce qui fonctionne

- PWA React/TypeScript/Vite.
- Interface FR/EN.
- Mention de création CR3@TIX dans le footer.
- Bouton flottant CR3@TIX Soutien relié à l’application officielle de soutien, automatiquement masqué pendant les exercices.
- Navigation multipage par routes hash compatibles GitHub Pages.
- Menu burger latéral remplaçant les anciens onglets horizontaux.
- Six domaines cognitifs.
- Modes Quick 36, Standard 72 et Deep 120.
- Sélection adaptative.
- Démonstrations facultatives, accessibles séparément du démarrage de l’évaluation.
- Entraînement indépendant.
- Sauvegarde et reprise via IndexedDB.
- Historique.
- Rapport de résultats.
- Correction détaillée de chaque réponse après une évaluation terminée.
- Export JSON.
- Service worker et fonctionnement hors ligne prévu.
- Tests unitaires Vitest.
- Tests navigateur Playwright.
- Simulation synthétique du moteur.
- Déploiement GitHub Pages.
- Icône SVG SYNAPTIK intégrée comme favicon, déclarée dans le manifeste et précachée par le service worker.

## Mesure actuelle

Le scoring est expérimental. Le dépôt documente explicitement :
- modèle IRT ;
- posterior discret ;
- score de présentation 100 + 15 × theta ;
- percentile théorique ;
- incertitude conditionnelle au modèle ;
- limites de calibration.

La version 1.1 améliore l’intégrité de mesure sans revendiquer de validation humaine.

## Documentation canonique existante

- `docs/ARCHITECTURE.md`
- `docs/SCORING.md`
- `docs/ADAPTIVE_TESTING.md`
- `docs/ITEM_BANK.md`
- `docs/CALIBRATION.md`
- `docs/PRIVACY.md`
- `docs/VALIDATION.md`

## Validation connue

La documentation du dépôt mentionne des validations CI réussies pour des versions antérieures et des parcours Chromium multi-tailles. Ces résultats ne doivent pas être extrapolés automatiquement à une future modification du moteur.

La modification d’icône ne touche pas au moteur cognitif ni au modèle de mesure.

## Points à améliorer

- Calibration humaine réelle des items.
- Constitution éventuelle d’un échantillon normatif.
- Validation séparée FR/EN.
- Relecture experte des contenus verbaux.
- Tests manuels sur appareils physiques.
- Audit accessibilité plus complet.
- Validation des seuils et durées.
- Analyse de fidélité et stabilité test-retest avec données humaines lorsque disponible.

## Bugs ouverts

Aucun bug bloquant n’est consigné ici. Les nouveaux bugs doivent être ajoutés à ce fichier puis, une fois compris, transformés en règle dans `BUG_RULES.md`.

## Dernière modification importante

Protection renforcée du bouton CR3@TIX Soutien : le Shadow DOM réinitialisait les styles de l’hôte et pouvait neutraliser l’attribut `hidden`. Le composant applique maintenant explicitement `display:none` et désactive les événements pointeur sur les pages Démonstration, Analyse et Entraînement. Le bouton est également masqué dès son montage si un exercice est déjà actif, afin d’éviter tout flash visuel.

## Prochaine priorité scientifique

Améliorer la précision par la qualité de calibration et la qualité des items, pas en resserrant artificiellement les intervalles ou en modifiant l’échelle pour obtenir des scores plus flatteurs.
