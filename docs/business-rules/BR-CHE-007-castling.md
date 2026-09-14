---
id: BR-CHE-007
domaine: CHE
titre: Roque (castling)
statut: active
invariant: true
source: src/engine/entities/game/move.ts
maj: 2026-09-14
---

# BR-CHE-007 — Roque (castling)

## Règle

Roi et tour n'ont jamais bougé. Pas de pièce entre. Roi ne passe pas par case attaquée. Roi n'est pas en check.

## Application (code)

- `src/engine/entities/game/move.ts::isCastling()` — détecte roque
- `src/engine/gameplay.ts::canCastle()` — valide roque

## Vérification

Test : `tests/engine/gameplay.test.ts`
