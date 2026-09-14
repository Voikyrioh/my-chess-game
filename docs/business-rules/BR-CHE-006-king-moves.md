---
id: BR-CHE-006
domaine: CHE
titre: Le roi se déplace d'une case dans toute direction
statut: active
invariant: true
source: src/engine/entities/pieces/king.ts
maj: 2026-09-14
---

# BR-CHE-006 — Le roi se déplace d'une case

Roi bouge 1 case vertical, horizontal ou diagonal. Ne peut pas se placer en check.

## Application (code)

- `src/engine/entities/pieces/king.ts::canMoveTo()`
