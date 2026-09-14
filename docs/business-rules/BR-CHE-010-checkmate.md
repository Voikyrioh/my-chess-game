---
id: BR-CHE-010
domaine: CHE
titre: Échec et mat (checkmate)
statut: active
invariant: true
source: src/engine/gameplay.ts
maj: 2026-09-14
---

# BR-CHE-010 — Échec et mat (checkmate)

Roi en échec + aucun coup légal = mat. Joueur a perdu.

## Application (code)

- `src/engine/gameplay.ts::isCheckmate()`
