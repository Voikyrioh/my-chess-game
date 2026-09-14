# Architecture — chess

Stack : TypeScript, Three.js, Vite · Style : clean architecture · Entrée : `src/index.ts`  
Maj : 2026-09-14

## Vue d'ensemble

Application de jeu d'échecs standalone. Moteur de logique pure en TypeScript, renderers HTML et 3D (Three.js). DOM utilities pour drag-and-drop/touch, modals pour promotion/checkmate. Tests Mocha+Chai.

## Carte

```
src/
├── engine/          → logique métier pur (pieces, board, gameplay)     [ARCHITECTURE.md]
├── game/            → renderers HTML et 3D
│   ├── 3d/         → Three.js renderer
│   └── html/       → DOM, drag-drop, modals
├── assets/          → images, 3D models
├── tools/           → utilitaires (observable, device detection)
└── vite-env.d.ts

docs/               → INDEX.md (adr, business-rules, components, bugs)
