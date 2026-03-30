import type Phaser from 'phaser';

export class LevelManager {
  level = 1;
  xp = 0;
  xpToNext = 60;

  constructor(private readonly scene: Phaser.Scene) {}

  addXp(amount: number): void {
    this.xp += amount;
    while (this.xp >= this.xpToNext) {
      this.xp -= this.xpToNext;
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.level += 1;
    this.xpToNext = Math.floor(60 + this.level * 28);
    this.scene.events.emit('player-level-up', { level: this.level });
  }

}
