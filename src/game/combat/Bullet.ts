import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  damage = 14;
  pierceRemaining = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    angle: number,
    speed: number,
    damage: number,
    pierce: number,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = damage;
    this.pierceRemaining = pierce;
    this.setDepth(7);
    this.body.setSize(14, 8);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.setRotation(angle);
  }
}
