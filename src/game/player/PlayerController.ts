import Phaser from 'phaser';
import type { Player } from './Player';

/** Screen-space deadzone for touch drag direction (virtual stick). */
const TOUCH_DRAG_DEADZONE_PX = 14;

export class PlayerController {
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;
  private pointerWasDown = false;
  private touchAnchorX = 0;
  private touchAnchorY = 0;

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
        if (!this.pointerWasDown) {
          this.touchAnchorX = pointer.x;
          this.touchAnchorY = pointer.y;
        }
        const dx = pointer.x - this.touchAnchorX;
        const dy = pointer.y - this.touchAnchorY;
        const len = Math.hypot(dx, dy);
        if (len > TOUCH_DRAG_DEADZONE_PX) {
          vx = (dx / len) * stats.moveSpeed;
          vy = (dy / len) * stats.moveSpeed;
        }
      }
    }
    this.pointerWasDown = this.scene.input.activePointer.isDown;
    this.player.setVelocity(vx, vy);
  }
}
