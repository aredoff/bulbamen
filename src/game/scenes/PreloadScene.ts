import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Preload' });
  }

  preload(): void {
    const mk = (key: string, w: number, h: number, fill: number, circle = false): void => {
      const g = this.add.graphics();
      g.fillStyle(fill, 1);
      if (circle) {
        g.fillCircle(w / 2, h / 2, w / 2);
      } else {
        g.fillRect(0, 0, w, h);
      }
      g.generateTexture(key, w, h);
      g.destroy();
    };
    mk('player', 22, 22, 0xe8e8f0, false);
    mk('enemy', 26, 26, 0xffffff, true);
    mk('bullet', 10, 4, 0xfff3a0, false);
    mk('orb', 10, 10, 0x4a90ff, true);
    mk('rocket', 14, 8, 0xff8c42, false);
    mk('enemy_bullet', 8, 8, 0xff5555, true);
  }

  create(): void {
    this.scene.start('Game');
    this.scene.launch('UI');
  }
}
