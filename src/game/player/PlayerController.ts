import Phaser from 'phaser';
import type { Player } from './Player';

const POINTER_DEADZONE = 18;

export class PlayerController {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Player,
  ) {
    const kb = scene.input.keyboard;
    if (kb) {
      this.cursors = kb.createCursorKeys();
      this.keyW = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }
  }

  update(): void {
    const stats = this.player.stats;
    let vx = 0;
    let vy = 0;
    if (this.cursors) {
      if (this.cursors.left?.isDown || this.keyA?.isDown) vx -= 1;
      if (this.cursors.right?.isDown || this.keyD?.isDown) vx += 1;
      if (this.cursors.up?.isDown || this.keyW?.isDown) vy -= 1;
      if (this.cursors.down?.isDown || this.keyS?.isDown) vy += 1;
    }
    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      vx = (vx / len) * stats.moveSpeed;
      vy = (vy / len) * stats.moveSpeed;
    } else {
      const pointer = this.scene.input.activePointer;
      if (pointer.isDown) {
        const dx = pointer.worldX - this.player.x;
        const dy = pointer.worldY - this.player.y;
        const len = Math.hypot(dx, dy);
        if (len > POINTER_DEADZONE) {
          vx = (dx / len) * stats.moveSpeed;
          vy = (dy / len) * stats.moveSpeed;
        }
      }
    }
    this.player.setVelocity(vx, vy);
  }
}
