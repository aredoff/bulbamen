export enum EnemyType {
  Basic = 'basic',
  Fast = 'fast',
  Tank = 'tank',
  Shooter = 'shooter',
}

export enum WeaponType {
  Projectile = 'projectile',
  Laser = 'laser',
  Rocket = 'rocket',
  Aura = 'aura',
  Lightning = 'lightning',
}

export type UpgradeId =
  | 'heal_hp'
  | 'add_weapon'
  | 'weapon_boost'
  | 'attack_speed'
  | 'move_speed'
  | 'enemy_reverse'
  | 'random_kill'
  | 'double_shot'
  | 'mana_bonus';

export interface EnemyConfigData {
  health: number;
  speed: number;
  contactDamage: number;
  scale: number;
  tint?: number;
}

export interface WeaponConfigData {
  baseCooldownMs: number;
  damage: number;
  laserRange?: number;
  laserWidth?: number;
  rocketSpeed?: number;
  rocketRadius?: number;
  auraRadius?: number;
  auraTickMs?: number;
  lightningChainMax?: number;
  lightningChainRange?: number;
}

export interface TextureKeys {
  player: string;
  enemy: string;
  bullet: string;
  orb: string;
  rocket: string;
  enemyBullet: string;
}
