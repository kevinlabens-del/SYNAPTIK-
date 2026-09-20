# SYNAPTIK — Règles permanentes de développement

Ce fichier est la règle de travail prioritaire pour toute IA ou tout développeur intervenant sur SYNAPTIK.

## 1. Mission

Faire évoluer SYNAPTIK sans casser les fonctions existantes, sans exagérer la précision psychométrique et sans transformer une estimation expérimentale en diagnostic clinique.

SYNAPTIK est une PWA React/TypeScript/Vite, local-first, FR/EN, destinée à l’évaluation cognitive expérimentale. Elle n’est pas un test clinique validé et ne doit jamais être présentée comme tel.

## 2. Lecture obligatoire avant modification

Toujours lire, selon la zone touchée :

- `MEMORY.md`
- `PROJECT_STATE.md`
- `FEATURES.md`
- `DESIGN_SYSTEM.md`
- `BUG_RULES.md`
- `TEST_PLAN.md`
- `docs/ARCHITECTURE.md`

Avant toute modification du moteur cognitif, lire aussi :

- `docs/SCORING.md`
- `docs/ADAPTIVE_TESTING.md`
- `docs/CALIBRATION.md`
- `docs/ITEM_BANK.md`
- `docs/VALIDATION.md`

## 3. Règles psychométriques non négociables

- Ne jamais modifier les paramètres, poids, intervalles, percentiles ou règles de sélection dans le but de produire des scores plus élevés, plus flatteurs ou artificiellement plus précis.
- Ne jamais réduire un intervalle d’incertitude uniquement pour donner une impression de précision.
- Ne jamais présenter `100 + 15 × theta` comme une normalisation humaine validée tant qu’un véritable échantillon normatif n’existe pas.
- Les simulations synthétiques servent à vérifier le comportement du modèle, jamais à prouver une validité humaine.
- Toute modification incompatible du modèle de mesure doit être versionnée et préserver l’interprétation des anciennes sessions.
- L’entraînement et les démonstrations ne doivent pas influencer le score d’évaluation.
- Les interruptions, temps, changements d’onglet et autres métriques comportementales restent descriptifs ou heuristiques ; ils ne prouvent ni triche ni diagnostic.
- Les différences de langue, culture, scolarité, âge et appareil doivent rester explicitement reconnues comme limites tant qu’elles ne sont pas calibrées.

## 4. Règles d’architecture

- Le moteur `src/cognitive/engine.ts` reste indépendant de React et du navigateur.
- La banque d’exercices reste séparée du moteur de scoring.
- Le stockage local reste encapsulé par `src/storage`.
- Les vues React ne doivent pas contenir de logique psychométrique dupliquée.
- Ne pas ajouter de backend, compte utilisateur, tracking externe ou collecte distante sans demande explicite.
- Ne jamais committer de secret, token ou clé privée.

## 5. Règles de compatibilité

- Préserver les anciennes sessions déjà enregistrées.
- Toute évolution de schéma doit prévoir fallback, migration ou lecture rétrocompatible.
- Ne pas supprimer silencieusement une propriété utilisée par une session historique.
- Conserver le fonctionnement FR/EN.
- Conserver les chemins compatibles GitHub Pages en sous-dossier.

## 6. Règles UI

Respecter `DESIGN_SYSTEM.md` et les tokens réels de `src/styles/tokens.css`.

Ne pas remplacer l’identité SYNAPTIK par un dashboard SaaS générique, un thème glassmorphism standard ou des cartes fortement arrondies sans demande explicite.

## 7. Après toute modification

Exécuter au minimum les tests définis dans `TEST_PLAN.md`.

Si le moteur cognitif, la banque, l’adaptation ou le scoring changent, exécuter aussi la simulation appropriée et documenter clairement ce qu’elle démontre et ce qu’elle ne démontre pas.

Mettre à jour la documentation concernée et :
- `PROJECT_STATE.md`
- `PROMPT_LOG.md`
- `MEMORY.md` si une décision durable change
- `BUG_RULES.md` si un bug significatif est compris
- `FEATURES.md` si une fonction change

## 8. Principe anti-régression

Une modification n’est pas terminée parce que le code compile.

Elle est terminée lorsque :
1. le comportement demandé fonctionne ;
2. les tests pertinents passent ;
3. les fonctions liées restent intactes ;
4. la documentation correspond à la réalité ;
5. aucune revendication scientifique supplémentaire non démontrée n’a été introduite.
