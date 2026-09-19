# Scoring expérimental v1

## Modèle

Pour chaque item i et capacité theta :

`P(correct | theta) = c + (1-c)/(1+exp(-a*(theta-b)))`.

b = difficulté provisoire {-2,-1,0,1,2} ; a=1, c=1/nombre d'options. Les variantes 1PL (a=1,c=0), 2PL (c=0) et 3PL sont supportées par la fonction probability. Le moteur utilise 3PL. Aucun paramètre n'est estimé à partir de participants humains.

Posterior discrétisé sur [-6,6] par pas .05, prior Normal(0,2²). Calcul en log-vraisemblance, soustraction du maximum avant exponentiation. EAP = moyenne du posterior, SE = écart-type posterior. L'élargissement du prior après simulation réduit l'attraction vers zéro mais ne garantit pas une récupération sans biais.

Le score par domaine est `round(100+15*theta)`. La transformation est une convention de présentation et non une normalisation empirique. Le score global utilise la moyenne des six theta, poids 1/6 chacun. Le domaine vitesse utilise des items limités à 8 secondes ; réponse fausse ou absence de réponse = échec. Il n'existe pas de bonus pour un clic rapide.

Percentile = `round(100*Phi(theta))`, Phi étant la CDF normale standard approchée numériquement. Il est théorique ; jamais « supérieur à X % des personnes testées ».

## Intervalle

Domaine : `100+15*(theta ± 1.96*SE*inflation)`. Approximation normale conditionnelle au modèle, non un intervalle clinique validé. Global : moyenne des SE des domaines plutôt que division par racine(6), choix conservateur face à une covariance inter-domaines inconnue. Inflation = 1+(100-indice)/100. L'indice n'agit pas sur le score central.

Cette approximation peut mal couvrir les capacités extrêmes. Les résultats de simulation sont conservés, y compris les biais. Plus de réponses ne garantit pas une réduction monotone de l'intervalle après chaque item. Aucune borne artificielle [70,130] n'est imposée.

## Indice de session

100 moins 60 × fraction de réponses très rapides, moins min(25,2 × changements d'onglet), moins 15 × fraction d'items interrompus. Réponse très rapide = moins de min(1500 ms, temps attendu × 100 ms). Borné à 0 minimum. Seuils heuristiques documentés, non diagnostiques, sans accusation de triche. La durée, première interaction, changements de sélection et interruption sont conservés par item.

## Limites majeures

Difficultés nominales non validées ; gabarits liés ; QCM et hasard ; effet d'apprentissage ; langue ; scolarité ; matériel ; absence d'étalonnage d'âge ; variation du temps de rendu ; vitesse binaire sous deadline plutôt qu'un modèle conjoint temps-précision. Pas d'estimation de facteur g validée. Une SE étroite ne corrige aucune de ces limites.

Référence de méthode (pas validation du produit) : Sharpnack et al., _BanditCAT and AutoIRT_, 2024, https://arxiv.org/abs/2410.21033 — calibration des paramètres, mise à jour bayésienne et sélection informative.
