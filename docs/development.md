# Development

## Add an enemy type

1. Add a value to `EnemyType` in `src/game/core/types.ts` (if new).
2. Add stats to `ENEMY_CONFIG` in `src/game/config/enemies.ts`.
3. Create `src/game/enemies/types/YourEnemy.ts` extending `BaseEnemy` (see `BasicEnemy.ts`).
4. Register in `EnemyFactory.create()`.
5. Optionally add to spawn weights in `EnemyManager.spawnRandom()`.

## Add a weapon type

1. Add `WeaponType` in `src/game/core/types.ts`.
2. Add `WEAPON_CONFIG` entry in `src/game/config/weapons.ts`.
3. Create `src/game/weapons/types/YourWeapon.ts` extending `BaseWeapon`; implement `tick(delta, ctx)`.
4. Register in `WeaponFactory.create()`.
5. If it should appear from **Add weapon** upgrade, add the type to the pool in `AddWeaponUpgrade.ts`.

## Add an upgrade

1. Add `UpgradeId` in `src/game/core/types.ts`.
2. Create `src/game/upgrades/types/YourUpgrade.ts` extending `BaseUpgrade` (`apply`, `maxStacks`, strings).
3. Register in `UpgradeFactory.create()` and `allIds()`.
4. Add weight in `src/game/config/upgrades.ts` (`UPGRADE_WEIGHTS`).

## Scene restart

**New Game** calls `GameScene.restart()`. Listeners on `this.game.events` must be removed on scene shutdown where needed (see `GameScene` `shutdown` handler for `upgrade-picked`).

## Assets

Generated textures live in `PreloadScene` (no binary assets required for the minimal style). Optional static files: `src/assets/`.
