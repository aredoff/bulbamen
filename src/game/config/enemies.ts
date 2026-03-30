import { EnemyType } from '../core/types';
import type { EnemyConfigData } from '../core/types';

export const ENEMY_CONFIG: Record<EnemyType, EnemyConfigData> = {
  [EnemyType.Basic]: {
    health: 18,
    speed: 85,
    contactDamage: 8,
    scale: 1,
    tint: 0xff6b6b,
  },
  [EnemyType.Fast]: {
    health: 10,
    speed: 150,
    contactDamage: 5,
    scale: 0.85,
    tint: 0xff9f43,
  },
  [EnemyType.Tank]: {
    health: 55,
    speed: 45,
    contactDamage: 14,
    scale: 1.35,
    tint: 0x5f27cd,
  },
  [EnemyType.Shooter]: {
    health: 22,
    speed: 60,
    contactDamage: 6,
    scale: 1,
    tint: 0x00d2d3,
  },
};

export const SHOOTER_FIRE_MS = 1800;
export const SHOOTER_BULLET_SPEED = 220;
export const SHOOTER_BULLET_DAMAGE = 12;
