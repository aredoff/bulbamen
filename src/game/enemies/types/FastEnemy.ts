import type Phaser from 'phaser';
import { EnemyType } from '../../core/types';
import { ENEMY_CONFIG } from '../../config/enemies';
import { BaseEnemy } from '../base/BaseEnemy';

export class FastEnemy extends BaseEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, EnemyType.Fast, ENEMY_CONFIG[EnemyType.Fast]);
  }
}
