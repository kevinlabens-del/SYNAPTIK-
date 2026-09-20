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

## BUG-013 — Texte anglais visible en mode français

**Risque :** un libellé codé en dur ou un identifiant technique apparaît en anglais malgré la sélection FR.

**Règle permanente :** tout texte visible, nom de mode ou sous-type présenté à l’utilisateur doit dépendre de la langue active. Les identifiants internes peuvent rester en anglais, mais leur affichage doit passer par la couche de localisation. Les tests E2E doivent conserver des vérifications explicites des principaux libellés français.

## BUG-014 — Test lié à un libellé traduit

**Symptôme :** l’application fonctionne et compile, mais le test E2E expire après la traduction d’un libellé d’accessibilité.

**Cause :** le test recherchait littéralement « Language » alors que l’interface française expose désormais « Langue ».

**Règle permanente :** pour les contrôles dont le nom change avec la langue, les tests E2E doivent utiliser un sélecteur stable ou accepter explicitement les deux langues, afin qu’une traduction légitime ne soit pas interprétée comme une régression fonctionnelle.

## BUG-015 — Mise à jour interrompant une évaluation

**Risque :** une nouvelle version recharge l’application pendant une préparation, une démonstration, une évaluation ou immédiatement sur le résultat.

**Règle permanente :** les mises à jour peuvent être téléchargées et activées silencieusement, mais la recharge automatique du client est autorisée uniquement sur les pages sûres : accueil, historique, entraînement et méthodologie. Une mise à jour détectée sur un écran sensible est différée jusqu’au prochain écran sûr ou jusqu’au prochain lancement de l’application.

## BUG-016 — Interface trop serrée sur petit mobile

**Risque :** cartes, options, matrices, boutons ou grands titres débordent ou deviennent trop étroits sur des écrans de 320 à 560 px.

**Règle permanente :** tester au minimum 320 px, 360 px et 390 px de large. Sur petit écran, privilégier une colonne, borner SVG/matrices à 100 % de la largeur disponible et empêcher les enfants flex/grid d’imposer une largeur minimale.

## BUG-017 — Lecture contaminant le temps de vitesse

**Risque :** l’utilisateur consomme une partie de la fenêtre chronométrée simplement pour comprendre la question.

**Règle permanente :** la question/consigne d’une tâche de vitesse doit être entièrement lisible sans chrono. Pour les nouvelles sessions 1.3, le stimulus et les choix restent cachés jusqu’au bouton « Je suis prêt » ; ils apparaissent ensuite en même temps que démarre la fenêtre de 8 secondes. Toute modification future de cette procédure doit être versionnée. Les sessions 1.2 conservent leurs 12 secondes historiques.

## BUG-018 — Impossible d’apprendre de ses erreurs

**Risque :** le résultat global indique une faiblesse sans permettre d’identifier les questions ratées.

**Règle permanente :** après une session terminée, rendre disponible une correction détaillée avec question, réponse utilisateur, bonne réponse et explication. Ne jamais afficher ces informations avant la fin de l’évaluation.

## BUG-019 — Route GitHub Pages cassée ou navigation non persistante

**Risque :** une navigation multipage utilisant des chemins serveur provoque des 404 sur GitHub Pages, ou un rechargement perd l’écran courant.

**Règle permanente :** utiliser les routes hash de SYNAPTIK, maintenir la correspondance route et état React, tester retour/avant navigateur et rechargement hors ligne, et restaurer depuis IndexedDB les écrans nécessitant une session lorsque c’est possible.

## BUG-020 — Ancienne interface persistante après un déploiement réussi

**Risque :** GitHub Pages contient la nouvelle version mais un appareil continue d’afficher un ancien `index.html` servi par le cache.

**Règle permanente :** les navigations doivent être réseau d’abord en ligne et cache d’abord uniquement pour les ressources statiques versionnées. Le service worker doit être enregistré avec `updateViaCache: "none"` et conserver un repli hors ligne fonctionnel.

## BUG-021 — Contrôle flottant perturbant un exercice

**Risque :** un bouton flottant externe recouvre une option, intercepte un toucher, prend le focus ou distrait pendant une tâche, notamment chronométrée.

**Règle permanente :** le bouton CR3@TIX Soutien doit être totalement masqué et non focusable sur les pages Démonstration, Analyse et Entraînement, ainsi que lorsqu’un composant `.exercise` est actif. Il ne peut réapparaître que sur une page non-exercice.
