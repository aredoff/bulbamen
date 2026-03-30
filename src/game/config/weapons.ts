import { WeaponType } from '../core/types';
import type { WeaponConfigData } from '../core/types';

/** Starting weapon when a new run begins (GameScene / resetWithStarter). */
export const START_WEAPON = WeaponType.Lightning;

export const WEAPON_CONFIG: Record<WeaponType, WeaponConfigData> = {
  [WeaponType.Projectile]: {
    baseCooldownMs: 480,
    damage: 14,
  },
  [WeaponType.Laser]: {
    baseCooldownMs: 1720,
    damage: 22,
    laserRange: 520,
    laserWidth: 14,
  },
  [WeaponType.Rocket]: {
    baseCooldownMs: 2100,
    damage: 35,
    rocketSpeed: 280,
    rocketRadius: 110,
  },
  [WeaponType.Aura]: {
    baseCooldownMs: 1,
    damage: 6,
    auraRadius: 100,
    auraTickMs: 420,
  },
  [WeaponType.Lightning]: {
    baseCooldownMs: 1480,
    damage: 16,
    lightningChainMax: 5,
    lightningChainRange: 340,
  },
};
