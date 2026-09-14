---
id: ADR-0002
titre: Three.js pour rendu 3D
type: librairie
statut: acceptée
date: 2026-09-14
portee: repo
remplace: —
liens: []
---

# ADR-0002 — Three.js pour rendu 3D

## Contexte

Besoin d'un rendu 3D du plateau d'échecs.

## Décision

Adopter Three.js v0.176 pour le rendu 3D côté client.

## Conséquences

- Dépendance `three@^0.176.0`.
- Rendu dans `src/game/3d/`.
