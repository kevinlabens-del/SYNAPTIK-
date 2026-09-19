# SYNAPTIK — Cognitive Intelligence Test

Explore the architecture of your mind.

**Application en ligne : https://kevinlabens-del.github.io/SYNAPTIK-/**

Application React/TypeScript/Vite expérimentale, local first, FR/EN. Six domaines, sélection adaptative, trois formats (36/72/120 items), démonstrations, entraînement indépendant, sauvegarde IndexedDB, historique, rapport imprimable, export JSON et service worker.

## Exécution

Node 22 ou ultérieur.

```sh
npm install
npm run dev
npm test
npm run lint
npm run build
npm run preview
npm run simulate
```

`npm run build` vérifie TypeScript puis produit `dist/`, incluant un service worker dont le cache est versionné à partir du contenu des bundles. Servir `dist/` en HTTPS. Les chemins relatifs permettent GitHub Pages dans un sous-dossier.

## GitHub Pages

GitHub Pages est activé avec **GitHub Actions**. Pour republier, exécuter **Deploy SYNAPTIK Pages** depuis Actions. Le workflow de validation s'exécute automatiquement à chaque push et publie un artefact compilé. Le déploiement Pages est volontairement distinct de la validation.

## Ce que signifie le score

**Ce logiciel ne mesure pas un QI validé.** L'échelle expérimentale 100 + 15 × theta utilise des paramètres d'items supposés. Les percentiles sont théoriques. Il n'existe aucun échantillon normatif, validation clinique ou étalonnage par âge. Les intervalles sont conditionnels au modèle et n'incluent pas l'erreur inconnue de calibration. L'indice de session est heuristique, pas une fiabilité psychométrique établie.

La banque contient 360 variantes par langue, issues de plusieurs gabarits. Ces variantes ne sont pas 360 concepts indépendants. Les contenus verbaux dans chaque langue restent à faire relire et valider séparément. Aucun item commercial n'a été reproduit.

## Vérification

`npm test` : tests du moteur et d'IndexedDB. `npm run test:e2e` : parcours navigateur, six tailles, reprise, entraînement, résultats et hors ligne (installer Chromium via `npx playwright install chromium`). GitHub Actions installe le navigateur automatiquement.

Voir [VALIDATION](docs/VALIDATION.md) pour les vérifications effectivement réalisées et les limites. Le simulateur produit 2 800 sessions artificielles : elles ne constituent jamais une validation humaine.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Scoring](docs/SCORING.md)
- [Adaptation](docs/ADAPTIVE_TESTING.md)
- [Banque](docs/ITEM_BANK.md)
- [Calibration](docs/CALIBRATION.md)
- [Confidentialité](docs/PRIVACY.md)
- [Validation](docs/VALIDATION.md)

Le débogage `?debug=true` n'existe que dans le build de développement. Les réponses correctes ne sont pas révélées pendant une évaluation. Comme toute application entièrement locale, le code et la banque restent inspectables : aucune protection anti-extraction n'est revendiquée.
