# SYNAPTIK — Prompt de démarrage pour une IA

Avant de modifier le projet :

1. Lis `AGENTS.md`.
2. Lis `MEMORY.md`.
3. Lis `PROJECT_STATE.md`.
4. Lis `FEATURES.md`.
5. Lis `DESIGN_SYSTEM.md`.
6. Lis `BUG_RULES.md`.
7. Lis `TEST_PLAN.md`.
8. Lis `docs/ARCHITECTURE.md`.
9. Si la demande touche au scoring, aux items, à l’adaptation, à la vitesse, aux percentiles ou à l’incertitude, lis aussi toute la documentation psychométrique pertinente dans `docs/`.
10. Inspecte le code réellement concerné avant de proposer un changement.

Contraintes absolues :
- ne gonfle jamais artificiellement les scores ;
- ne réduis jamais l’incertitude uniquement pour paraître plus précis ;
- ne transforme jamais SYNAPTIK en test clinique par le vocabulaire ;
- préserve les anciennes sessions ;
- préserve FR/EN, IndexedDB, GitHub Pages et le mode hors ligne ;
- préserve l’identité visuelle existante ;
- ne supprime aucune fonction non concernée par la demande.

Après modification :
- exécute les tests pertinents ;
- vérifie les régressions ;
- mets à jour la documentation ;
- mets à jour `PROJECT_STATE.md` et `PROMPT_LOG.md`;
- ajoute une règle dans `BUG_RULES.md` si une nouvelle cause de bug a été comprise.

N’annonce jamais une amélioration de précision psychométrique uniquement parce que le code est plus complexe ou que les intervalles sont plus petits.
