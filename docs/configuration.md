# Configuration

## Starting weapon

File: `src/game/config/weapons.ts`

```ts
export const START_WEAPON = WeaponType.Projectile;
```

Change to `WeaponType.Laser`, `WeaponType.Rocket`, or `WeaponType.Aura`. Used by `WeaponManager.resetWithStarter()` (new run and **New Game** after game over).

## Weapon stats

File: `src/game/config/weapons.ts` — `WEAPON_CONFIG` per `WeaponType`: cooldowns, damage, laser range/width, rocket speed/radius, aura radius/tick.

## Enemy stats

File: `src/game/config/enemies.ts` — `ENEMY_CONFIG` per `EnemyType`, plus shooter tuning (`SHOOTER_FIRE_MS`, bullet speed/damage).

## Upgrade weights

File: `src/game/config/upgrades.ts` — `UPGRADE_WEIGHTS` for random level-up offers. Stacks per upgrade are defined in each upgrade class (`maxStacks`).

## Global tuning

File: `src/game/utils/constants.ts`

- `WORLD_WIDTH` / `WORLD_HEIGHT` — bounds
- `GAME_WIDTH` / `GAME_HEIGHT` — base game resolution (Phaser config)
- `MAX_WEAPONS` — usually 3
- Spawn intervals, orb XP base, etc.

## TypeScript

`tsconfig.json` — `erasableSyntaxOnly` is off to allow enums and constructor parameter properties used across the project.
