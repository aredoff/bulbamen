# Documentation

Minimal Survivors — browser game (Phaser 3, TypeScript, Vite).

## Contents

| Document | Description |
|----------|-------------|
| [Getting started](getting-started.md) | Install, run, build |
| [Architecture](architecture.md) | Scenes, folders, game flow |
| [Configuration](configuration.md) | Weapons, enemies, upgrades, tuning |
| [Development](development.md) | Adding enemies, weapons, upgrades |

## Tech stack

- **TypeScript**, **Phaser 3**, **Vite**
- **Arcade Physics** for movement and collisions
- **Scale mode**: `RESIZE` — canvas fills the browser viewport

## Entry point

- `src/main.ts` — creates `Phaser.Game` via `createGameConfig()` in `src/game/core/GameConfig.ts`
