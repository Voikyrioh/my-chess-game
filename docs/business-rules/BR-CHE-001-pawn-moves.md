---
id: BR-CHE-001
domaine: CHE
titre: Le pion se déplace droit, capture en diagonale
statut: active
invariant: true
source: src/engine/entities/pieces/pawn.ts
maj: 2026-09-14
---

# BR-CHE-001 — Le pion se déplace droit, capture en diagonale

## Règle

- Pion blanc : monte (+y), noir : descend (-y).
- Déplacement : 1 case avant (ou 2 si première rangée).
- Capture : 1 case avant-diagonale.
- Pas de capture en avant.

## Application (code)

- `src/engine/entities/pieces/pawn.ts::canMoveTo()` — valide le mouvement

## Vérification

Test : `tests/engine/pieces/pawn.test.ts`
