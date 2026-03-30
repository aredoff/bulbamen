import Phaser from 'phaser';
import type { BaseUpgrade } from '../upgrades/base/BaseUpgrade';
import type { PlayerStats } from '../player/PlayerStats';
import type { LevelManager } from '../xp/LevelManager';

export class UIScene extends Phaser.Scene {
  private hudText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private overlay?: Phaser.GameObjects.Container;
  private gameOverRoot?: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'UI' });
  }

  create(): void {
    this.hudText = this.add.text(16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#e8e8f0',
    });
    this.hudText.setScrollFactor(0);
    this.hudText.setDepth(100);

    this.scoreText = this.add.text(this.scale.width - 16, 14, '', {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#e8e8f0',
    });
    this.scoreText.setOrigin(1, 0);
    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(100);

    this.game.events.on('show-upgrade-picker', this.showUpgradePicker, this);
    this.game.events.on('player-dead', this.onPlayerDead, this);
  }

  private onPlayerDead(): void {
    if (this.gameOverRoot) return;
    const cx = this.scale.width / 2;
    const cy = this.scale.height / 2;
    const root = this.add.container(0, 0);
    root.setScrollFactor(0);
    root.setDepth(200);

    const title = this.add.text(cx, cy - 36, 'GAME OVER', {
      fontFamily: 'monospace',
      fontSize: '42px',
      color: '#ff6b6b',
    });
    title.setOrigin(0.5);

    const btn = this.add.text(cx, cy + 56, 'New Game', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#e8f4ff',
      backgroundColor: '#2a3f5c',
      padding: { x: 28, y: 14 },
    });
    btn.setOrigin(0.5);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      root.destroy(true);
      this.gameOverRoot = undefined;
      const gs = this.scene.get('Game');
      if (gs) gs.scene.restart();
    });

    root.add([title, btn]);
    this.gameOverRoot = root;
  }

  private showUpgradePicker(payload: { choices: BaseUpgrade[] }): void {
    this.overlay?.destroy(true);
    const w = this.scale.width;
    const h = this.scale.height;
    const root = this.add.container(0, 0);
    root.setScrollFactor(0);
    root.setDepth(500);

    const bg = this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.72);
    bg.setScrollFactor(0);

    const title = this.add.text(w / 2, 80, 'LEVEL UP — pick one', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#ffffff',
    });
    title.setOrigin(0.5);
    title.setScrollFactor(0);

    root.add([bg, title]);

    let y = 160;
    for (const u of payload.choices) {
      const btn = this.add.text(w / 2, y, `${u.title}\n${u.description}`, {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#cfefff',
        align: 'center',
        backgroundColor: '#1e2a38',
        padding: { x: 16, y: 12 },
      });
      btn.setOrigin(0.5);
      btn.setScrollFactor(0);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.game.events.emit('upgrade-picked', { id: u.id });
        root.destroy(true);
        this.overlay = undefined;
      });
      root.add(btn);
      y += 110;
    }

    this.overlay = root;
  }

  update(): void {
    const stats = this.game.registry.get('playerStats') as PlayerStats | undefined;
    const lm = this.game.registry.get('levelManager') as LevelManager | undefined;
    if (!stats || !lm) return;
    this.hudText.setText(
      `HP ${Math.floor(stats.hp)}/${Math.floor(stats.maxHp)}   Lv ${lm.level}   XP ${Math.floor(lm.xp)}/${lm.xpToNext}`,
    );
    const score = (this.game.registry.get('score') as number | undefined) ?? 0;
    this.scoreText.setX(this.scale.width - 16);
    this.scoreText.setText(`Score ${score}`);
  }
}
