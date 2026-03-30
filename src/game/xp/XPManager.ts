import type Phaser from 'phaser';
import { BASE_XP_PER_ORB } from '../utils/constants';
import type { Player } from '../player/Player';
import { XPOrb } from './XPOrb';

export class XPManager {
  readonly group: Phaser.Physics.Arcade.Group;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Player,
    texture: string,
  ) {
    this.group = scene.physics.add.group({ runChildUpdate: false });
    this.scene.events.on(
      'enemy-died',
      (payload: { x: number; y: number }) => {
        this.spawnOrbs(payload.x, payload.y, texture);
      },
    );
  }

  spawnOrbs(x: number, y: number, texture: string): void {
    const n = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++) {
      const ox = x + (Math.random() - 0.5) * 40;
      const oy = y + (Math.random() - 0.5) * 40;
      const orb = new XPOrb(this.scene, ox, oy, texture, BASE_XP_PER_ORB);
      this.group.add(orb);
    }
  }

  collectOrb(orb: XPOrb): number {
    let v = orb.value;
    const s = this.player.stats;
    if (s.manaBonusOrbsRemaining > 0) {
      v = Math.floor(v * 1.2);
      s.manaBonusOrbsRemaining -= 1;
    }
    orb.destroy();
    return v;
  }
}
