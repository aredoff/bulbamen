import Phaser from 'phaser';
import type { Player } from './Player';

export class PlayerController {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyS: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;

  constructor(
    scene: Phaser.Scene,
    private readonly player: Player,
  ) {
    if (!scene.input.keyboard) {
      throw new Error('Keyboard required');
    }
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update(): void {
    const stats = this.player.stats;
    let vx = 0;
    let vy = 0;
    if (this.cursors.left?.isDown || this.keyA.isDown) vx -= 1;
    if (this.cursors.right?.isDown || this.keyD.isDown) vx += 1;
    if (this.cursors.up?.isDown || this.keyW.isDown) vy -= 1;
    if (this.cursors.down?.isDown || this.keyS.isDown) vy += 1;
    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * stats.moveSpeed;
      vy = (vy / len) * stats.moveSpeed;
    }
    this.player.setVelocity(vx, vy);
  }
}
