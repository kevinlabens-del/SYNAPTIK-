# Calibration future

Statut actuel : experimental. Le type accepte experimental/provisional/validated ; ces statuts ne doivent jamais changer automatiquement en fonction du nombre de sessions simulées.

Étapes avant provisional : revue de contenu par domaine et langue, pilote consenti auprès d'adultes, contrôle d'ambiguïté, difficultés et discriminations estimées, réponses au hasard, temps de réponse, corrélations point-bisériales, dépendance locale entre variantes, analyse des données manquantes et interruptions.

Étapes avant validated : protocole préenregistré avec psychométricien, échantillon normatif représentatif suffisamment dimensionné, validation croisée hors échantillon, analyses DIF âge/langue/appareil, validité convergente, stabilité test-retest et incertitude empirique. La taille requise dépend du modèle et du protocole : aucun nombre magique n'est promis.

Les items trop faibles sont désactivables via enabled. Leur retrait impose une nouvelle version de banque et une analyse de comparabilité. Les sessions sauvegardent testVersion et les items leur version.

Collecte : aucun backend actif. Consentement explicite pour préparer un fichier local facultatif. Export avec ID aléatoire, âge par tranche, réponses, temps, versions et paramètres retrouvables dans la banque. Pas de nom, email, géolocalisation ni date précise dans l'export de calibration. Toute transmission future exigera destinataire et consentement spécifiques.

Simulation : `npm run simulate` exécute 400 sessions Quick à chacune des capacités -3,-2,-1,0,1,2,3, soit 2800. Résultats dans SIMULATION.json. Elle mesure récupération, RMSE et couverture sous notre propre modèle génératif. Elle ne teste ni compréhension des items, ni biais humains, ni validité cognitive. Une récupération favorable ne prouve pas la validité du test.
