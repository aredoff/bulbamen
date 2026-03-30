import Phaser from 'phaser';
import { PlayerStats } from './PlayerStats';

export class Player extends Phaser.Physics.Arcade.Sprite {
  readonly stats = new PlayerStats();

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(10);
  }

  takeDamage(amount: number): void {
    this.stats.takeDamage(amount);
  }

  isDead(): boolean {
    return this.stats.hp <= 0;
  }
}
