import Phaser from 'phaser';
import { EnemyType } from '../../core/types';
import { ENEMY_CONFIG } from '../../config/enemies';
import { SHOOTER_FIRE_MS, SHOOTER_BULLET_SPEED } from '../../config/enemies';
import { BaseEnemy } from '../base/BaseEnemy';
import type { Player } from '../../player/Player';
import { EnemyBullet } from '../../combat/EnemyBullet';

export class ShooterEnemy extends BaseEnemy {
  private shootCd = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, EnemyType.Shooter, ENEMY_CONFIG[EnemyType.Shooter]);
  }

  tickMovement(player: Player, inverted: boolean): void {
    super.tickMovement(player, inverted);
  }

  tickShoot(
    delta: number,
    player: Player,
    group: Phaser.Physics.Arcade.Group,
    texture: string,
  ): void {
    this.shootCd -= delta;
    if (this.shootCd > 0) return;
    this.shootCd = SHOOTER_FIRE_MS;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const b = new EnemyBullet(this.scene, this.x, this.y, texture, angle, SHOOTER_BULLET_SPEED);
    group.add(b);
    b.setVelocity(
      Math.cos(angle) * SHOOTER_BULLET_SPEED,
      Math.sin(angle) * SHOOTER_BULLET_SPEED,
    );
  }
}
