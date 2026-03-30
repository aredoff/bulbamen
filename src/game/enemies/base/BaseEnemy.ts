import Phaser from 'phaser';
import type { EnemyType } from '../../core/types';
import type { EnemyConfigData } from '../../core/types';
import type { Player } from '../../player/Player';

export abstract class BaseEnemy extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  maxHealth: number;
  health: number;
  moveSpeed: number;
  contactDamage: number;
  readonly enemyType: EnemyType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    enemyType: EnemyType,
    config: EnemyConfigData,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.enemyType = enemyType;
    this.maxHealth = config.health;
    this.health = config.health;
    this.moveSpeed = config.speed;
    this.contactDamage = config.contactDamage;
    if (config.tint !== undefined) this.setTint(config.tint);
    this.setScale(config.scale);
    this.setCircle(this.width / 2);
    this.setDepth(5);
  }

  tickMovement(player: Player, inverted: boolean): void {
    const mult = inverted ? -1 : 1;
    const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const sp = this.moveSpeed * mult;
    this.setVelocity(Math.cos(angle) * sp, Math.sin(angle) * sp);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
    if (this.health <= 0) {
      const payload = { x: this.x, y: this.y, type: this.enemyType };
      this.scene.events.emit('enemy-died', payload);
      this.destroy();
    }
  }
}
