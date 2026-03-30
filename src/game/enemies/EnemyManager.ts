import type Phaser from 'phaser';
import { EnemyType } from '../core/types';
import type { Player } from '../player/Player';
import { EnemyFactory } from './base/EnemyFactory';
import type { BaseEnemy } from './base/BaseEnemy';
import { ShooterEnemy } from './types/ShooterEnemy';
import { spawnPointOutsideCamera, clampToWorld } from '../systems/SpawnSystem';
import { pickRandom } from '../utils/random';

export class EnemyManager {
  readonly group: Phaser.Physics.Arcade.Group;
  private readonly factory = new EnemyFactory();
  private spawnTimer = 0;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly player: Player,
    private readonly enemyBulletGroup: Phaser.Physics.Arcade.Group,
  ) {
    this.group = scene.physics.add.group({ runChildUpdate: false });
  }

  spawnRandom(): void {
    const p = spawnPointOutsideCamera(this.scene, this.player);
    const c = clampToWorld(this.scene, p.x, p.y);
    const type = pickRandom([
      EnemyType.Basic,
      EnemyType.Basic,
      EnemyType.Fast,
      EnemyType.Tank,
      EnemyType.Shooter,
    ]);
    const e = this.factory.create(this.scene, type, c.x, c.y);
    this.group.add(e);
  }

  tick(
    delta: number,
    player: Player,
    inverted: boolean,
    enemyBulletTexture: string,
    randomKillChance: number,
  ): void {
    const children = this.group.getChildren() as BaseEnemy[];
    for (const e of children) {
      if (!e.active) continue;
      e.tickMovement(player, inverted);
      if (e instanceof ShooterEnemy) {
        e.tickShoot(delta, player, this.enemyBulletGroup, enemyBulletTexture);
      }
      if (randomKillChance > 0 && Math.random() < randomKillChance * (delta / 1000)) {
        this.scene.events.emit('random-kill-proc', { x: e.x, y: e.y });
        e.takeDamage(e.health + 1);
      }
    }
  }

  tickSpawn(delta: number, intervalMs: number): void {
    this.spawnTimer += delta;
    if (this.spawnTimer >= intervalMs) {
      this.spawnTimer = 0;
      this.spawnRandom();
    }
  }
}
