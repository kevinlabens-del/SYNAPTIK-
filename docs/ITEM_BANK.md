# Banque v1

360 variantes FR et 360 EN, 60 par domaine, générées à seed fixe et versionnées. Options mélangées de façon reproductible ; ordre adaptatif variable par session.

| Domaine   | Familles implémentées                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- |
| Logique   | inclusion/exclusion conditionnelle, transformation symbolique, ordre                                 |
| Spatial   | rotation/réflexion de motifs 3×3 et de points avec coordonnées                                       |
| Numérique | suites arithmétiques/secondes différences, proportion, suites alternées                              |
| Mémoire   | chiffres directs/inversés, associations lettre-chiffre, motifs de positions, présentation temporaire, 2-back séquentiel |
| Verbal    | analogies lexicales, catégorisation, signification contextuelle                                      |
| Vitesse   | comparaison de chaînes symboliques, recherche/comptage visuel                                        |

`id,domain,subtype,difficulty,discrimination,guessing,estimatedTime,prompt,options,correctAnswer,explanation,tags,version,sampleSize,successRate,averageResponseTime,pointBiserialCorrelation,enabled,lang`.

Les banques verbales sont déclarées par langue ; leurs relations sont actuellement parallèles et non validées linguistiquement. 20 analogies, 20 catégorisations et 20 significations contextuelles sont définies dans chaque langue. La banque verbale ne réutilise plus trois formulations de la même analogie. Les difficultés sont des paramètres d'ingénierie, pas une mesure empirique.

Les familles assemblages complexes, vues 3D interactives, matrices à règles multiples, inhibition et planification ne sont pas encore implémentées. Leur ajout nécessite des renderers dédiés et un audit d'ambiguïté. Cette limite est explicite plutôt que remplacée par des items artificiellement renommés.

Originaux générés pour ce projet ; aucune banque commerciale importée. Une revue humaine indépendante est nécessaire avant d'employer le terme « validé ».
