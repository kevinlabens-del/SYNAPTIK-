# Sélection adaptative

Rotation équilibrée entre les six domaines. Chaque domaine maintient son posterior indépendant. Information de Fisher : dérivée de P au carré / [P(1-P)]. Sélection par information au theta actuel + bruit seedé [0,.12) et pénalité .4 pour exposition dans une autre session. Aucun ID ni contenu identique répété dans la session ; les paramètres `enabled` et `lang` filtrent les candidats.

Départ theta=0 ; aucun réglage à partir de l'âge. Les paramètres provisoires peuvent sélectionner un item nominalement facile pour une question textuellement difficile : la calibration humaine doit résoudre cet écart. La sélection est reproductible avec seed + numéro de réponse et même historique.

Arrêt fixe : Quick 36, Standard 72, Deep 120. Aucun arrêt prématuré par précision revendiquée. Durées annoncées indicatives, pas des garanties validées par un pilote.

À étendre : contraintes de familles, suppression de variantes sémantiquement équivalentes, contrôle d'exposition global, sélection par information posterior moyenne, critères d'arrêt validés et équilibrage des contenus.
