# Confidentialité

Aucun compte, traceur, API analytique, nom, email ou géolocalisation. IndexedDB conserve localement réponses, identifiant aléatoire, âge par tranche, langue, appareil déclaré, dates, consentement et indicateurs de session.

Exporter, supprimer une session ou tout effacer depuis Mes résultats. La suppression requiert confirmation dans l'interface. Les exports complets sont des fichiers personnels contenant les dates et résultats : les partager est une décision de l'utilisateur. L'export de calibration retire date précise et appareil et renouvelle l'identifiant.

Le consentement à l'export ne déclenche aucun envoi. Les futures transmissions ne sont pas autorisées par défaut. Les requêtes d'hébergement initiales peuvent être journalisées par l'hébergeur, indépendamment de l'application.

Les données locales ne sont pas chiffrées par une clé applicative. Toute personne ayant accès au profil du navigateur peut potentiellement les lire. Effacer les données navigateur supprime les sessions ; l'application ne promet pas leur récupération. Le service worker cache uniquement les ressources de l'application.
