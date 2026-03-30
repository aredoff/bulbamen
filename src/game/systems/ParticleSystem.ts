import Phaser from 'phaser';

export class ParticleSystem {
  burst(scene: Phaser.Scene, x: number, y: number, color: number, count = 10): void {
    for (let i = 0; i < count; i++) {
      const p = scene.add.circle(x, y, 2 + Math.random() * 2, color, 0.9);
      p.setDepth(20);
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 120;
      scene.tweens.add({
        targets: p,
        x: x + Math.cos(a) * sp * 0.4,
        y: y + Math.sin(a) * sp * 0.4,
        alpha: 0,
        duration: 280 + Math.random() * 120,
        onComplete: () => p.destroy(),
      });
    }
  }
}
