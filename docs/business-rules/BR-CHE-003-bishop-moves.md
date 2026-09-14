---
id: BR-CHE-003
domaine: CHE
titre: Le fou se déplace en diagonale
statut: active
invariant: true
source: src/engine/entities/pieces/bishop.ts
maj: 2026-09-14
---

# BR-CHE-003 — Le fou se déplace en diagonale

Fou se déplace librement en diagonale jusqu'à pièce. Capture adverse uniquement.

## Application (code)

- `src/engine/entities/pieces/bishop.ts::canMoveTo()`
