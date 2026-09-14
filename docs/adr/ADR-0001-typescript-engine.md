---
id: ADR-0001
titre: TypeScript pour logique pure
type: architecture
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0001 — TypeScript pour logique pure

## Contexte

Moteur de jeu d'échecs pur sans dépendances externes pour la logique.

## Décision

Implémenter la logique métier (board, pieces, gameplay) en TypeScript pur, sans frameworks. Testable avec Mocha+Chai.

## Comment l'appliquer

- `engine/` = zéro dépendance sur DOM/renderers.
- Chaque classe métier testée isolément.

## Conséquences

- Logique réutilisable dans n'importe quel renderer (HTML, WebGL, CLI).
