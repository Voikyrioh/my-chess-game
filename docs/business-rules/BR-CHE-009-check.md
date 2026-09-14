---
id: BR-CHE-009
domaine: CHE
titre: Échec (check)
statut: active
invariant: true
source: src/engine/gameplay.ts
maj: 2026-09-14
---

# BR-CHE-009 — Échec (check)

Roi attaqué par pièce adverse = échec. Joueur doit quitter l'échec (bloquer, capturer, fuir).

## Application (code)

- `src/engine/gameplay.ts::isInCheck()`
