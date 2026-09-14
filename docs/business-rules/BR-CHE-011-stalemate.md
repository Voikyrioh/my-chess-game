---
id: BR-CHE-011
domaine: CHE
titre: Pat (stalemate)
statut: active
invariant: true
source: src/engine/gameplay.ts
maj: 2026-09-14
---

# BR-CHE-011 — Pat (stalemate)

Roi pas en échec + aucun coup légal = pat. Match nul (draw).

## Application (code)

- `src/engine/gameplay.ts::isStalemate()`
