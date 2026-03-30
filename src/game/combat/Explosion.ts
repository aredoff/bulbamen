import Phaser from 'phaser';

export class Explosion extends Phaser.GameObjects.Graphics {
  constructor(scene: Phaser.Scene, x: number, y: number, radius: number) {
    super(scene);
    this.setPosition(x, y);
    this.setDepth(15);
    this.lineStyle(2, 0xff6b35, 0.75);
    this.strokeCircle(0, 0, radius);
    scene.add.existing(this);
    scene.time.delayedCall(140, () => this.destroy());
  }
}
