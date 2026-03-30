import Phaser from 'phaser';
import { WeaponType } from '../../core/types';
import { WEAPON_CONFIG } from '../../config/weapons';
import { BaseWeapon } from '../base/BaseWeapon';
import type { WeaponContext } from '../WeaponContext';
import { nearestEnemy } from '../../utils/math';
import { lineCircleHit, pointOutsideRectAlongRay, rayExitWorldBounds } from '../../utils/math';
import type { BaseEnemy } from '../../enemies/base/BaseEnemy';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../../utils/constants';

const LASER_FX_MS = 140;
const MUZZLE_MARGIN = 3;

export class LaserWeapon extends BaseWeapon {
  private laserFx: Phaser.Time.TimerEvent | null = null;

  constructor(level = 1) {
    super(WeaponType.Laser, WEAPON_CONFIG[WeaponType.Laser].baseCooldownMs, level);
  }

  private static muzzle(ctx: WeaponContext, angle: number): { x: number; y: number } {
    const b = ctx.player.body as Phaser.Physics.Arcade.Body;
    const hw = b.width * 0.5;
    const hh = b.height * 0.5;
    return pointOutsideRectAlongRay(ctx.player.x, ctx.player.y, hw, hh, angle, MUZZLE_MARGIN);
  }

  private static renderLaser(
    g: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    pulse: number,
    sparkR: number,
    widthBoost: number,
    muzzleFlare: number,
  ): void {
    g.clear();
    const wb = widthBoost;
    const outerW = (5 + pulse * 10) * wb;
    const midW = (2.5 + pulse * 4) * wb;
    const coreW = (1.2 + pulse * 0.8) * wb;

    g.lineStyle(outerW, 0xff0044, 0.28 + pulse * 0.22);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(outerW * 0.65, 0xff2266, 0.38 + pulse * 0.2);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(midW, 0xff5588, 0.55 + pulse * 0.25);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(coreW, 0xffffff, 0.92);
    g.lineBetween(x1, y1, x2, y2);

    if (muzzleFlare > 0.05) {
      g.fillStyle(0xff0044, muzzleFlare * 0.45);
      g.fillCircle(x1, y1, 5 + muzzleFlare * 9);
      g.fillStyle(0xffaac0, muzzleFlare * 0.35);
      g.fillCircle(x1, y1, 2.5 + muzzleFlare * 4);
    }

    g.fillStyle(0xff0044, 0.55 + pulse * 0.25);
    g.fillCircle(x2, y2, sparkR);
    g.fillStyle(0xffaac0, 0.35);
    g.fillCircle(x2, y2, sparkR * 0.55);
    g.fillStyle(0xffffff, 0.75);
    g.fillCircle(x2, y2, sparkR * 0.28);
  }

  tick(delta: number, ctx: WeaponContext): void {
    const cfg = WEAPON_CONFIG[WeaponType.Laser];
    this.cooldownMs = cfg.baseCooldownMs;
    if (!this.tryFire(delta, ctx.stats.effectiveAttackSpeedMult)) return;
    const target = nearestEnemy(ctx.player.x, ctx.player.y, ctx.enemies);
    if (!target) {
      this.timer += this.cooldownMs * 0.5;
      return;
    }
    const angle = Phaser.Math.Angle.Between(
      ctx.player.x,
      ctx.player.y,
      target.x,
      target.y,
    );

    const dmg = this.boostDamage(cfg.damage, ctx);
    const hitR = 14;
    const hitThisShot = new Set<BaseEnemy>();

    const applyLaserHits = (): void => {
      const m = LaserWeapon.muzzle(ctx, angle);
      const e = rayExitWorldBounds(m.x, m.y, angle, WORLD_WIDTH, WORLD_HEIGHT);
      const list = [...ctx.enemies.getChildren()];
      for (const obj of list) {
        const enemy = obj as BaseEnemy;
        if (!enemy.active || hitThisShot.has(enemy)) continue;
        if (
          lineCircleHit(m.x, m.y, e.x, e.y, enemy.x, enemy.y, enemy.width * 0.35 + hitR)
        ) {
          enemy.takeDamage(dmg);
          hitThisShot.add(enemy);
        }
      }
    };

    applyLaserHits();

    const g = ctx.laserGraphics;
    if (this.laserFx) {
      this.laserFx.destroy();
      this.laserFx = null;
    }
    g.clear();

    const startTime = ctx.scene.time.now;
    const spark0 = 4 + Math.random() * 5;
    const t0 = 0;
    const widthBoost0 = 1 + 0.75 * Math.exp(-t0 / 32);
    const flare0 = Math.exp(-t0 / 28);
    const m0 = LaserWeapon.muzzle(ctx, angle);
    const e0 = rayExitWorldBounds(m0.x, m0.y, angle, WORLD_WIDTH, WORLD_HEIGHT);
    LaserWeapon.renderLaser(
      g,
      m0.x,
      m0.y,
      e0.x,
      e0.y,
      0.52,
      spark0,
      widthBoost0,
      flare0,
    );

    this.laserFx = ctx.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        const t = ctx.scene.time.now - startTime;
        if (t >= LASER_FX_MS) {
          g.clear();
          if (this.laserFx) {
            this.laserFx.destroy();
            this.laserFx = null;
          }
          return;
        }
        applyLaserHits();
        const pulse = 0.52 + 0.48 * Math.sin(t * 0.11);
        const sparkR = 3 + pulse * 7 + Math.random() * 4;
        const widthBoost = 1 + 0.75 * Math.exp(-t / 32);
        const muzzleFlare = Math.exp(-t / 28);
        const m = LaserWeapon.muzzle(ctx, angle);
        const e = rayExitWorldBounds(m.x, m.y, angle, WORLD_WIDTH, WORLD_HEIGHT);
        LaserWeapon.renderLaser(g, m.x, m.y, e.x, e.y, pulse, sparkR, widthBoost, muzzleFlare);
      },
    });
  }
}
