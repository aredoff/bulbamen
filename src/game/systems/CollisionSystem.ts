import Phaser from 'phaser';
import type { Player } from '../player/Player';
import { BaseEnemy } from '../enemies/base/BaseEnemy';
import { Bullet } from '../combat/Bullet';
import { Rocket } from '../combat/Rocket';
import { EnemyBullet } from '../combat/EnemyBullet';
import type { XPOrb } from '../xp/XPOrb';
import type { XPManager } from '../xp/XPManager';
import type { LevelManager } from '../xp/LevelManager';
import type { ParticleSystem } from './ParticleSystem';
import { Explosion } from '../combat/Explosion';

export class CollisionSystem {
  setup(
    scene: Phaser.Scene,
    player: Player,
    enemies: Phaser.Physics.Arcade.Group,
    bullets: Phaser.Physics.Arcade.Group,
    rockets: Phaser.Physics.Arcade.Group,
    enemyBullets: Phaser.Physics.Arcade.Group,
    xpManager: XPManager,
    levelManager: LevelManager,
    particles: ParticleSystem,
  ): void {
    scene.physics.add.overlap(bullets, enemies, (obj1, obj2) => {
      const bullet = obj1 instanceof Bullet ? obj1 : (obj2 as Bullet);
      const enemy = obj2 instanceof BaseEnemy ? obj2 : (obj1 as BaseEnemy);
      if (!bullet.active || !enemy.active) return;
      enemy.takeDamage(bullet.damage);
      if (bullet.pierceRemaining > 0) {
        bullet.pierceRemaining -= 1;
      } else {
        bullet.destroy();
      }
    });

    scene.physics.add.overlap(rockets, enemies, (a, _b) => {
      const rocket = a as Rocket;
      if (!rocket.active || rocket.getData('boom')) return;
      rocket.setData('boom', true);
      const r = rocket.blastRadius;
      const dmg = rocket.damage;
      enemies.getChildren().forEach((obj) => {
        const e = obj as BaseEnemy;
        if (!e.active) return;
        const d = Phaser.Math.Distance.Between(rocket.x, rocket.y, e.x, e.y);
        if (d <= r + e.width * 0.3) {
          e.takeDamage(dmg);
        }
      });
      void new Explosion(scene, rocket.x, rocket.y, r);
      particles.burst(scene, rocket.x, rocket.y, 0xff6b35, 14);
      rocket.destroy();
    });

    scene.physics.add.overlap(player, enemyBullets, (_p, eb) => {
      const bullet = eb as EnemyBullet;
      player.takeDamage(bullet.damage);
      bullet.destroy();
    });

    scene.physics.add.overlap(player, xpManager.group, (_p, orb) => {
      const o = orb as XPOrb;
      const v = xpManager.collectOrb(o);
      levelManager.addXp(v);
    });
  }
}
