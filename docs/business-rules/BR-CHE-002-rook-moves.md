---
id: BR-CHE-002
domaine: CHE
titre: La tour se déplace horizontalement/verticalement
statut: active
invariant: true
source: src/engine/entities/pieces/rook.ts
maj: 2026-09-14
---

# BR-CHE-002 — La tour se déplace horizontalement/verticalement

## Règle

La tour se déplace librement sur une ligne ou colonne jusqu'à rencontrer une pièce. Elle capture la pièce adverse, pas la sienne.

## Application (code)

- `src/engine/entities/pieces/rook.ts::canMoveTo()` — valide mouvement horizontal/vertical
