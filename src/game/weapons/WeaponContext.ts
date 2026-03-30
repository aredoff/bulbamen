import type Phaser from 'phaser';
import type { Player } from '../player/Player';
import type { PlayerStats } from '../player/PlayerStats';
import type { DamageSystem } from '../combat/DamageSystem';

export interface WeaponContext {
  scene: Phaser.Scene;
  player: Player;
  enemies: Phaser.Physics.Arcade.Group;
  bulletGroup: Phaser.Physics.Arcade.Group;
  rocketGroup: Phaser.Physics.Arcade.Group;
  damageSystem: DamageSystem;
  stats: PlayerStats;
  registerProjectileShot: () => void;
  laserGraphics: Phaser.GameObjects.Graphics;
  auraGraphics: Phaser.GameObjects.Graphics;
  lightningGraphics: Phaser.GameObjects.Graphics;
}
