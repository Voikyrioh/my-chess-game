---
id: BR-CHE-008
domaine: CHE
titre: Promotion du pion
statut: active
invariant: true
source: src/engine/entities/pieces/pawn.ts
maj: 2026-09-14
---

# BR-CHE-008 — Promotion du pion

Pion atteint dernière rangée = promotion en dame/tour/fou/cavalier (rarement cavalier). Obligatoire.

## Application (code)

- `src/engine/gameplay.ts::handlePromotion()` — détecte et applique promotion
