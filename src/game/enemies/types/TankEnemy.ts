import type Phaser from 'phaser';
import { EnemyType } from '../../core/types';
import { ENEMY_CONFIG } from '../../config/enemies';
import { BaseEnemy } from '../base/BaseEnemy';

export class TankEnemy extends BaseEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, EnemyType.Tank, ENEMY_CONFIG[EnemyType.Tank]);
  }
}
