# SYNAPTIK — Prompt d’audit indépendant

N’effectue aucune modification au départ.

Analyse SYNAPTIK comme un auditeur technique et méthodologique qui découvre le projet.

## Audit logiciel

Recherche :
- bugs fonctionnels ;
- régressions ;
- code mort ;
- fonctions incomplètes ;
- erreurs de persistance ;
- incompatibilités de sessions ;
- problèmes PWA ;
- erreurs de cache ;
- erreurs GitHub Pages ;
- problèmes responsive ;
- problèmes d’accessibilité ;
- erreurs console ;
- problèmes de performance ;
- dépendances inutiles.

## Audit de mesure

Recherche :
- fuite de réponse ;
- contamination entraînement/évaluation ;
- répétitions ou quasi-répétitions d’items ;
- biais introduits par la sélection ;
- incohérences de difficulté ;
- mauvaise gestion des interruptions ;
- contamination des temps de vitesse ;
- erreurs de posterior ou d’intervalle ;
- incompatibilités entre versions ;
- revendications plus fortes que les preuves disponibles ;
- confusion entre simulation et validation humaine.

## Audit contenu

Vérifie séparément FR et EN :
- ambiguïtés ;
- réponses multiples plausibles ;
- dépendance excessive à la culture ou à la scolarité ;
- incohérences de traduction ;
- indices involontaires ;
- gabarits trop similaires.

## Sortie attendue

Pour chaque problème :
- gravité ;
- preuve dans le code ou la documentation ;
- impact ;
- fichiers concernés ;
- correction proposée ;
- risque de la correction ;
- test anti-régression à ajouter.

Ne modifie le code qu’après avoir produit l’audit complet.

Ne conclus jamais que SYNAPTIK mesure un QI clinique valide sans données humaines et validation appropriées.
