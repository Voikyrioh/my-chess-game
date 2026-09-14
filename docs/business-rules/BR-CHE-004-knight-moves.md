---
id: BR-CHE-004
domaine: CHE
titre: Le cavalier se déplace en L (2 cases + 1 perpendiculaire)
statut: active
invariant: true
source: src/engine/entities/pieces/knight.ts
maj: 2026-09-14
---

# BR-CHE-004 — Le cavalier se déplace en L

Saute 2 cases dans une direction + 1 perpendiculaire. Peut sauter par-dessus pièces. Capture sur destination uniquement.

## Application (code)

- `src/engine/entities/pieces/knight.ts::canMoveTo()`
