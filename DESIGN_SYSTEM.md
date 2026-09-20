# SYNAPTIK — Design System

Ce fichier formalise l’identité visuelle déjà présente dans `src/styles`. Le code CSS réel reste la source d’exécution.

## Direction artistique

SYNAPTIK doit évoquer :
- intelligence cognitive ;
- réseau neuronal ;
- instrumentation scientifique ;
- laboratoire numérique futuriste ;
- précision et sobriété.

Éviter :
- dashboard SaaS générique ;
- grosses cartes blanches ;
- gradients arc-en-ciel décoratifs ;
- glassmorphism omniprésent ;
- rayons très arrondis ;
- surcharge d’animations ;
- esthétique de jeu mobile enfantine.

## Tokens actuels

Source : `src/styles/tokens.css`.

- Fond : `#05070d`
- Surface : `#080d18`
- Cyan : `#54f4ff`
- Bleu : `#00c8ff`
- Violet : `#7c4dff`
- Texte : `#edfaff`
- Texte secondaire : `#99aabd`
- Ligne/bordure : `#243040`
- Rayon principal : `6px`

## Typographie

- Interface : Inter, puis Segoe UI en fallback.
- Micro-libellés techniques : monospace.
- Titres : grandes tailles, graisse modérée, espacement serré.
- Eyebrows : monospace, uppercase, tracking important, cyan.
- Score principal : très grand, fin, cyan.

## Composants

### Bouton principal
- fond cyan ;
- texte très sombre ;
- faible rayon ;
- minimum 56 px sur le CTA principal actuel ;
- contraste fort ;
- animation discrète.

### Navigation
- sobre ;
- texte secondaire par défaut ;
- état actif cyan avec soulignement/ligne ;
- pas de navigation en pilules épaisses.

### Cartes / modes
- surfaces sombres ;
- bordures fines ;
- angles assez nets ;
- gradient discret possible ;
- sélection signalée par cyan et bordure/ligne, pas seulement par couleur de fond.

## Réseau neuronal

Le SVG neuronal, ses synapses, halos, orbites et nœuds lumineux font partie de l’identité de SYNAPTIK.

Le supprimer ou le remplacer par une illustration générique nécessite une demande explicite.

## Animation

Principes actuels :
- respiration lente des nœuds ;
- arrivée courte des exercices ;
- désactivation en mode test ;
- respect de `prefers-reduced-motion`.

Toute nouvelle animation doit être informative ou renforcer l’identité sans perturber une tâche cognitive chronométrée.

## Responsive

- largeur minimale actuelle : 320 px ;
- mobile prioritaire ;
- tests existants sur plusieurs viewports ;
- aucun débordement horizontal accepté ;
- les contrôles de réponse doivent rester confortables au toucher.

## Règle cognitive UI

Pendant une question, le design ne doit pas donner d’indice involontaire sur la bonne réponse, modifier la difficulté par une animation ou introduire une latence évitable.

Les tâches de vitesse doivent minimiser toute contamination par le rendu, la lecture d’instructions et le délai de confirmation.
