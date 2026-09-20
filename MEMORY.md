# SYNAPTIK — Mémoire durable du projet

## Identité

**Nom :** SYNAPTIK TEST QI  
**Type :** PWA d’évaluation cognitive expérimentale  
**Stack :** React 19 + TypeScript + Vite  
**Langues :** français et anglais  
**Déploiement :** GitHub Pages  
**URL :** https://kevinlabens-del.github.io/SYNAPTIK-/  
**Stockage :** local-first via IndexedDB  
**Backend :** aucun actuellement

## Objectif durable

Évaluer plusieurs dimensions cognitives et produire un profil détaillé avec score global, scores par domaine, estimation expérimentale sur une échelle de type QI, percentile théorique, intervalle d’incertitude, vitesse et indicateurs de régularité.

L’application doit chercher la meilleure rigueur possible pour un produit non clinique tout en affichant honnêtement ses limites.

## Domaines

Six domaines permanents :
- logique
- spatial
- numérique
- mémoire
- verbal
- vitesse

## Modes

- Quick : 36 items
- Standard : 72 items
- Deep : 120 items

## Principe de mesure

Le moteur utilise un modèle IRT expérimental avec posterior discret. Les paramètres d’items sont encore des paramètres d’ingénierie et non une calibration populationnelle humaine.

La transformation de présentation `100 + 15 × theta` n’est pas une normalisation clinique.

Le percentile est théorique tant qu’aucune norme humaine représentative n’existe.

## Version de mesure

La version 1.1 introduit notamment :
- exclusion des réponses interrompues de la vraisemblance pour les nouvelles sessions ;
- quantiles postérieurs 2,5 % / 97,5 % par domaine ;
- démarrage proche de difficulté moyenne ;
- couverture des sous-types ;
- écran de préparation des tâches de vitesse ;
- séparation du temps de sélection et du délai de confirmation.

La version 1.2 conserve toutes les règles de mesure 1.1 et a utilisé une fenêtre de 12 secondes pour les tâches de vitesse.

La version 1.3 revient à la fenêtre originale de 8 secondes, tout en séparant explicitement la lecture et l’exercice : la question/consigne est lisible sans chrono, puis l’utilisateur appuie sur « Je suis prêt ». Le stimulus chronométré et les choix n’apparaissent qu’à ce moment-là et les 8 secondes commencent alors. Les sessions 1.2 historiques conservent leur durée de 12 secondes.

Les anciennes sessions doivent conserver leur logique historique.

## Règles permanentes

- Ne jamais gonfler artificiellement les scores.
- Ne jamais présenter SYNAPTIK comme un diagnostic médical ou un test de QI cliniquement validé.
- Ne jamais confondre simulation synthétique et validation humaine.
- L’entraînement ne doit pas contaminer l’évaluation.
- Les données restent locales sauf changement explicitement décidé.
- Les réponses correctes ne doivent pas être révélées pendant une évaluation.
- La correction détaillée des réponses n’est visible qu’après la fin de l’évaluation.
- Une reprise de session doit rester cohérente et traçable.

## Architecture canonique

La documentation de référence est `docs/ARCHITECTURE.md`.

Points stables :
- `src/cognitive` : mesure, adaptation, simulation, types ;
- `src/exercises` : banque/génération des exercices ;
- `src/storage` : persistance locale ;
- `src/app` : interface et parcours ;
- `src/styles` : identité visuelle ;
- `tests` : invariants moteur/stockage ;
- `e2e` : parcours navigateur ;
- `public` : manifeste, icônes, service worker.

## Navigation permanente

SYNAPTIK TEST QI utilise une navigation multipage côté application avec des routes hash compatibles GitHub Pages. Les sections principales sont accessibles via un menu burger et possèdent des URL distinctes. Les onglets horizontaux ne doivent pas être réintroduits sans demande explicite.

Routes stables : exploration, préparation, démonstration, analyse, résultat, résultats, entraînement et méthodologie. Le rechargement d’une route d’analyse doit tenter de restaurer la session active depuis IndexedDB.

## Intégration CR3@TIX Soutien

SYNAPTIK TEST QI affiche le bouton flottant officiel « ❤ Soutenir » de CR3@TIX Soutien. Son URL canonique est `https://kevinlabens-del.github.io/CR3-TIX-SOUTIEN-/`. Le bouton doit rester indépendant du moteur cognitif, ne doit pas modifier les données de session et doit être entièrement masqué/non focusable pendant toute démonstration, analyse ou séance d’entraînement.

## Identité visuelle durable

Fond très sombre, cyan lumineux, bleu et violet, structure technique/neuronale, typographie principale Inter avec micro-libellés monospace, angles plutôt nets et faible rayon.

Le réseau neuronal SVG est un élément d’identité du produit.

## Limites à conserver visibles tant qu’elles existent

- absence de norme humaine représentative ;
- absence de validation clinique ;
- absence d’étalonnage par âge ;
- paramètres d’items provisoires ;
- équivalence FR/EN non validée ;
- influence possible de la scolarité, culture, matériel et apprentissage ;
- vitesse non calibrée comme mesure clinique du temps de traitement.
