import type Phaser from 'phaser';
import { EnemyType } from '../../core/types';
import { BasicEnemy } from '../types/BasicEnemy';
import { FastEnemy } from '../types/FastEnemy';
import { TankEnemy } from '../types/TankEnemy';
import { ShooterEnemy } from '../types/ShooterEnemy';
import type { BaseEnemy } from './BaseEnemy';

const TEXTURE = 'enemy';

export class EnemyFactory {
  create(scene: Phaser.Scene, type: EnemyType, x: number, y: number): BaseEnemy {
    switch (type) {
      case EnemyType.Basic:
        return new BasicEnemy(scene, x, y, TEXTURE);
      case EnemyType.Fast:
        return new FastEnemy(scene, x, y, TEXTURE);
      case EnemyType.Tank:
        return new TankEnemy(scene, x, y, TEXTURE);
      case EnemyType.Shooter:
        return new ShooterEnemy(scene, x, y, TEXTURE);
      default:
        return new BasicEnemy(scene, x, y, TEXTURE);
    }
  }
}
