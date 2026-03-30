import Phaser from 'phaser';

export class XPOrb extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  value = 8;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, value: number) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.value = value;
    this.setScale(0.45);
    this.setCollideWorldBounds(false);
    this.setDepth(4);
    this.body.setSize(8, 8);
  }
}
