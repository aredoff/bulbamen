import Phaser from 'phaser';

export class Rocket extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  damage = 35;
  readonly blastRadius: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    angle: number,
    speed: number,
    damage: number,
    blastRadius: number,
  ) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.damage = damage;
    this.blastRadius = blastRadius;
    this.setDepth(7);
    this.body.setSize(14, 8);
    this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    this.setRotation(angle);
  }
}
