# SYNAPTIK — Règles issues des bugs et risques connus

Chaque bug significatif corrigé doit ajouter une règle ici afin qu’il ne soit pas réintroduit.

## BUG-001 — Score artificiellement amélioré

**Risque :** modifier paramètres, poids, prior, échelle ou intervalles pour augmenter les résultats.

**Règle permanente :** tout changement psychométrique doit être justifié par une amélioration de mesure, documenté et testé. Un résultat plus élevé ou un intervalle plus étroit n’est jamais une preuve d’amélioration.

## BUG-002 — Rupture des anciennes sessions

**Risque :** une nouvelle logique de scoring réinterprète silencieusement des sessions historiques.

**Règle permanente :** versionner toute modification de mesure incompatible et conserver une branche logique de compatibilité pour les anciennes sessions.

## BUG-003 — Interruption comptée comme vraie réponse

**Risque :** une reprise ou interruption contamine la vraisemblance, l’exactitude ou le temps.

**Règle permanente :** pour les versions qui utilisent l’exclusion, conserver la réponse dans l’historique mais respecter `excluded: true` dans les calculs concernés.

## BUG-004 — Temps de vitesse contaminé

**Risque :** mesurer lecture, confirmation ou temps hors écran comme vitesse cognitive.

**Règle permanente :** séparer l’écran de préparation, le temps de sélection, l’expiration et la confirmation. Ne pas inclure arbitrairement des délais UI dans la mesure.

## BUG-005 — Entraînement contaminant l’évaluation

**Règle permanente :** entraînement et démonstration ne doivent pas créer ou modifier une session évaluée ni influencer le score.

## BUG-006 — Répétition d’items

**Règle permanente :** éviter répétition d’ID et de fingerprint dans une même session et conserver les contrôles de couverture des sous-types.

## BUG-007 — Percentile présenté comme rang observé

**Règle permanente :** tant qu’aucune norme représentative n’existe, présenter le percentile comme théorique et ne pas écrire « meilleur que X % des personnes testées ».

## BUG-008 — Faux sentiment de validité

**Règle permanente :** une simulation synthétique, une CI verte ou une SE étroite ne permettent jamais d’écrire que le QI est cliniquement exact.

## BUG-009 — Régression IndexedDB

**Règle permanente :** toute évolution des sessions doit tester création, sauvegarde après réponse, reprise, restauration historique et effacement.

## BUG-010 — Régression PWA / GitHub Pages

**Règle permanente :** conserver les chemins relatifs compatibles avec le sous-dossier GitHub Pages. Après changement du manifest, du service worker ou du build, tester installation, cache, mise à jour et hors-ligne.

## BUG-011 — Régression FR/EN

**Règle permanente :** toute nouvelle fonction visible ou tout nouvel item doit être vérifié dans les deux langues. L’équivalence linguistique ne doit pas être supposée psychométriquement valide.

## BUG-012 — Design générique

**Règle permanente :** les nouvelles pages doivent réutiliser les tokens, la typographie, le langage neuronal et les composants existants plutôt que créer un second langage graphique.
