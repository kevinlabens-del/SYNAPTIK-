# Banque v1

360 variantes FR et 360 EN, 60 par domaine, générées à seed fixe et versionnées. Options mélangées de façon reproductible ; ordre adaptatif variable par session.

| Domaine | Familles implémentées |
|---|---|
| Logique | inclusion/exclusion conditionnelle, transformation symbolique, ordre |
| Spatial | rotation d'un point, réflexion axiale avec coordonnées |
| Numérique | suites arithmétiques/secondes différences, proportion, suites alternées |
| Mémoire | chiffres directs et inversés, présentation temporaire |
| Verbal | analogies lexicales, formulations de relations et complétions |
| Vitesse | comparaison de chaînes symboliques, recherche/comptage visuel |

`id,domain,subtype,difficulty,discrimination,guessing,estimatedTime,prompt,options,correctAnswer,explanation,tags,version,sampleSize,successRate,averageResponseTime,pointBiserialCorrelation,enabled,lang`.

Les banques verbales sont déclarées par langue ; leurs relations sont actuellement parallèles et non validées linguistiquement. 20 relations lexicales sont reformulées trois fois. Il ne faut pas présenter ces 60 formulations comme 60 concepts indépendants. Les difficultés sont des paramètres d'ingénierie, pas une mesure empirique.

Les familles cubes 3D, assemblages, matrices avancées, N-back, mémoire de positions, inhibition et planification ne sont pas encore implémentées. Leur ajout nécessite des renderers dédiés et un audit d'ambiguïté. Cette limite est explicite plutôt que remplacée par des items artificiellement renommés.

Originaux générés pour ce projet ; aucune banque commerciale importée. Une revue humaine indépendante est nécessaire avant d'employer le terme « validé ».
