# src/engine/ — Logique métier chess

Maj : 2026-09-14

## Contenu

- `entities/` — domaine : Board, Pieces (King, Queen, Rook, Bishop, Knight, Pawn), Player, Move, Position, FEN notation, Game history
- `gameplay.ts` — orchestration des tours, validation de coups
- `simulation.ts` — simulation de positions futures
- `index.ts` — export racine

## Règles du dossier

- Aucune dépendance sur `game/` (renderers).
- Aucun I/O (DOM, fichiers).
- Chaque pièce implémente déplacement légal via `canMoveTo()`.

## Points d'entrée

- `gameplay::Gameplay` — contrôle du jeu (coups, vérification check/checkmate)
- `entities/pieces::ChessPiece` — interface d'une pièce
