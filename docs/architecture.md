# Architecture

## Scenes

| Key | Class | Role |
|-----|-------|------|
| `Preload` | `PreloadScene` | Generates placeholder textures, then starts `Game` and launches `UI` |
| `Game` | `GameScene` | World, player, enemies, projectiles, XP, combat |
| `UI` | `UIScene` | HUD (HP, level, XP), level-up choices, game over + **New Game** |

`UIScene` stays active over the game. Cross-scene communication uses `this.game.events` and `this.game.registry` (e.g. player stats for HUD).

## World vs screen

- Fixed **logical** size in `src/game/utils/constants.ts` (`GAME_WIDTH`, `GAME_HEIGHT`) as base resolution.
- **World** size: `WORLD_WIDTH` × `WORLD_HEIGHT` — larger than the view; camera follows the player.
- Phaser **scale** (`RESIZE`) stretches the game to the `#game-container` (full viewport in `index.html`).

## Core loop (`GameScene`)

1. Input → `PlayerController` (WASD / arrows)
2. `EnemyManager` — spawn timer, movement, shooter bullets
3. `WeaponManager` — all equipped weapons `tick(delta, ctx)`
4. Collisions via `CollisionSystem.setup` (registered once) + contact damage in `update`
5. `LevelManager` — XP thresholds; on level up → pause `Game`, emit upgrade picker to UI
6. Off-screen cleanup for bullets / enemy bullets

## Module layout (`src/game/`)

| Area | Purpose |
|------|---------|
| `core/` | `GameConfig`, `types` enums |
| `scenes/` | Phaser scenes |
| `player/` | `Player`, `PlayerStats`, `PlayerController` |
| `enemies/` | `BaseEnemy`, per-type classes, `EnemyFactory`, `EnemyManager` |
| `weapons/` | `BaseWeapon`, per-type classes, `WeaponFactory`, `WeaponManager` |
| `upgrades/` | `BaseUpgrade`, per-type classes, `UpgradeFactory`, `UpgradeManager` |
| `combat/` | `Bullet`, `Rocket`, `EnemyBullet`, `Explosion`, `DamageSystem` |
| `systems/` | Spawn helpers, collisions, particles, movement helpers |
| `xp/` | `XPOrb`, `XPManager`, `LevelManager` |
| `config/` | Data tables: `enemies.ts`, `weapons.ts`, `upgrades.ts` |
| `utils/` | Math helpers, RNG, shared constants |

## Patterns

- **Factories** create concrete enemy / weapon / upgrade instances by id.
- **Managers** hold runtime state (active weapons, enemy group, upgrade stacks).
- **Physics groups** (`physics.add.group`) — note: adding a body to a Physics Group applies group defaults; velocities set in constructors may need to be reapplied **after** `group.add()` (see projectile / rocket / enemy bullet code).
