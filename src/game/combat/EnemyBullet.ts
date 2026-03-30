import Phaser from 'phaser';
import { SHOOTER_BULLET_DAMAGE } from '../config/enemies';

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  readonly damage = SHOOTER_BULLET_DAMAGE;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    angle: number,
    speed: number,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(6);
    this.body.setSize(7, 7);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.setRotation(angle);
  }
}
