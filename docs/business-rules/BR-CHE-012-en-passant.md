---
id: BR-CHE-012
domaine: CHE
titre: Prise en passant (en passant)
statut: active
invariant: false
source: src/engine/entities/pieces/pawn.ts
maj: 2026-09-14
---

# BR-CHE-012 — Prise en passant (en passant)

Pion avance 2 cases depuis première rangée. Pion adverse sur 5e rangée peut le capturer comme s'il n'avait avancé que d'1 case. Coup optionnel, doit être joué immédiatement.

## Application (code)

- `src/engine/entities/pieces/pawn.ts::canEnPassant()` — détecte possibilité
