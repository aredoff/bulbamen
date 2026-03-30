import Phaser from 'phaser';
import { WeaponType } from '../../core/types';
import { WEAPON_CONFIG } from '../../config/weapons';
import { BaseWeapon } from '../base/BaseWeapon';
import type { WeaponContext } from '../WeaponContext';
import { nearestEnemy, nearestEnemyExcluding, pointOutsideRectAlongRay } from '../../utils/math';
import type { BaseEnemy } from '../../enemies/base/BaseEnemy';

const FX_MS = 160;
const MUZZLE_MARGIN = 3;

export class LightningWeapon extends BaseWeapon {
  private lightningFx: Phaser.Time.TimerEvent | null = null;

  constructor(level = 1) {
    super(WeaponType.Lightning, WEAPON_CONFIG[WeaponType.Lightning].baseCooldownMs, level);
  }

  /** Same idea as LaserWeapon.muzzle: origin on player hull along locked aim. */
  private static muzzleAtAngle(ctx: WeaponContext, angle: number): { x: number; y: number } {
    const b = ctx.player.body as Phaser.Physics.Arcade.Body;
    const hw = b.width * 0.5;
    const hh = b.height * 0.5;
    return pointOutsideRectAlongRay(ctx.player.x, ctx.player.y, hw, hh, angle, MUZZLE_MARGIN);
  }

  private static buildChain(
    ctx: WeaponContext,
    first: BaseEnemy,
    maxJumps: number,
    rangeSq: number,
  ): BaseEnemy[] {
    const chain: BaseEnemy[] = [first];
    const exclude = new Set<Phaser.GameObjects.GameObject>([first]);
    let from = first;
    while (chain.length < maxJumps) {
      const next = nearestEnemyExcluding(from.x, from.y, ctx.enemies, exclude, rangeSq);
      if (!next) break;
      chain.push(next as BaseEnemy);
      exclude.add(next);
      from = next as BaseEnemy;
    }
    return chain;
  }

  /** Jagged polyline: steps along chord + random offset, last vertex exact (x2,y2). */
  private static lightningPolyline(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    segments: number,
    spread: number,
  ): Array<{ x: number; y: number }> {
    const pts: Array<{ x: number; y: number }> = [{ x: x1, y: y1 }];
    for (let i = 0; i < segments; i++) {
      const t = (i + 1) / segments;
      const tx = x1 + (x2 - x1) * t;
      const ty = y1 + (y2 - y1) * t;
      pts.push({
        x: tx + (Math.random() - 0.5) * spread,
        y: ty + (Math.random() - 0.5) * spread,
      });
    }
    pts.push({ x: x2, y: y2 });
    return pts;
  }

  private static strokePolyline(
    g: Phaser.GameObjects.Graphics,
    pts: Array<{ x: number; y: number }>,
    w: number,
    color: number,
    alpha: number,
  ): void {
    if (pts.length < 2) return;
    g.lineStyle(w, color, alpha);
    for (let i = 0; i < pts.length - 1; i++) {
      g.lineBetween(pts[i]!.x, pts[i]!.y, pts[i + 1]!.x, pts[i + 1]!.y);
    }
  }

  private static drawBolt(
    g: Phaser.GameObjects.Graphics,
    waypoints: Array<{ x: number; y: number }>,
    flicker: number,
  ): void {
    g.clear();
    const glowLayers = [
      { w: 22, color: 0x00b4ff, alpha: 0.06 + flicker * 0.05 },
      { w: 14, color: 0x5c00c8, alpha: 0.12 + flicker * 0.08 },
      { w: 8, color: 0x00d4ff, alpha: 0.22 + flicker * 0.12 },
      { w: 3.2, color: 0xc8f4ff, alpha: 0.5 + flicker * 0.2 },
      { w: 1.6, color: 0xffffff, alpha: 0.92 },
    ];
    const branchLayers = [
      { w: 10, color: 0x0088cc, alpha: 0.1 + flicker * 0.06 },
      { w: 4, color: 0x66eeff, alpha: 0.35 + flicker * 0.12 },
      { w: 1.2, color: 0xffffff, alpha: 0.65 },
    ];

    const mx = waypoints[0]!.x;
    const my = waypoints[0]!.y;
    const mf = 0.35 + flicker * 0.35;
    g.fillStyle(0x00b4ff, mf * 0.35);
    g.fillCircle(mx, my, 5 + mf * 8);
    g.fillStyle(0xffffff, mf * 0.4);
    g.fillCircle(mx, my, 2 + mf * 3);

    for (let wi = 1; wi < waypoints.length; wi++) {
      const wx = waypoints[wi]!.x;
      const wy = waypoints[wi]!.y;
      const pulse = 6 + flicker * 7;
      g.fillStyle(0x00d9ff, 0.1 + flicker * 0.08);
      g.fillCircle(wx, wy, pulse * 1.45);
      g.fillStyle(0xffffff, 0.22 + flicker * 0.14);
      g.fillCircle(wx, wy, pulse * 0.32);
    }

    for (let s = 0; s < waypoints.length - 1; s++) {
      const ax = waypoints[s]!.x;
      const ay = waypoints[s]!.y;
      const bx = waypoints[s + 1]!.x;
      const by = waypoints[s + 1]!.y;
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 4) continue;
      const segments = Math.max(8, Math.min(14, Math.floor(len / 28)));
      const spread = Math.min(46, Math.max(10, len * 0.075));
      const pts = LightningWeapon.lightningPolyline(ax, ay, bx, by, segments, spread);
      for (const layer of glowLayers) {
        LightningWeapon.strokePolyline(g, pts, layer.w, layer.color, layer.alpha);
      }

      if (len > 70 && Math.random() < 0.55) {
        const idx = 2 + Math.floor(Math.random() * Math.max(1, pts.length - 5));
        const branchLen = Math.min(52, len * 0.38);
        const ang = Math.random() * Math.PI * 2;
        const ex = pts[idx]!.x + Math.cos(ang) * branchLen;
        const ey = pts[idx]!.y + Math.sin(ang) * branchLen;
        const bpts = LightningWeapon.lightningPolyline(
          pts[idx]!.x,
          pts[idx]!.y,
          ex,
          ey,
          5,
          spread * 0.42,
        );
        for (const layer of branchLayers) {
          LightningWeapon.strokePolyline(g, bpts, layer.w, layer.color, layer.alpha);
        }
      }
    }
  }

  tick(delta: number, ctx: WeaponContext): void {
    const cfg = WEAPON_CONFIG[WeaponType.Lightning];
    this.cooldownMs = cfg.baseCooldownMs;
    if (!this.tryFire(delta, ctx.stats.effectiveAttackSpeedMult)) return;

    const first = nearestEnemy(ctx.player.x, ctx.player.y, ctx.enemies);
    if (!first) {
      this.timer += this.cooldownMs * 0.5;
      return;
    }

    const maxJumps = cfg.lightningChainMax ?? 5;
    const range = cfg.lightningChainRange ?? 320;
    const rangeSq = range * range;
    const chain = LightningWeapon.buildChain(ctx, first as BaseEnemy, maxJumps, rangeSq);

    const aimAngle = Phaser.Math.Angle.Between(
      ctx.player.x,
      ctx.player.y,
      chain[0]!.x,
      chain[0]!.y,
    );

    const dmg = this.boostDamage(cfg.damage, ctx);
    const victims = [...chain];
    for (const e of victims) {
      e.takeDamage(dmg);
    }
    if (!chain.some((e) => e.active)) {
      return;
    }

    const g = ctx.lightningGraphics;
    if (this.lightningFx) {
      this.lightningFx.destroy();
      this.lightningFx = null;
    }

    const startTime = ctx.scene.time.now;
    const render = (): void => {
      const alive = chain.filter((e) => e.active);
      if (alive.length === 0) {
        g.clear();
        if (this.lightningFx) {
          this.lightningFx.destroy();
          this.lightningFx = null;
        }
        return;
      }
      const muzzle = LightningWeapon.muzzleAtAngle(ctx, aimAngle);
      const waypoints = [
        { x: muzzle.x, y: muzzle.y },
        ...alive.map((e) => ({ x: e.x, y: e.y })),
      ];
      const t = ctx.scene.time.now - startTime;
      const flicker = 0.45 + 0.55 * Math.sin(t * 0.09) * Math.sin(t * 0.031 + 1.2);
      LightningWeapon.drawBolt(g, waypoints, Math.max(0, Math.min(1, flicker)));
    };
    render();

    this.lightningFx = ctx.scene.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        const t = ctx.scene.time.now - startTime;
        if (t >= FX_MS) {
          g.clear();
          if (this.lightningFx) {
            this.lightningFx.destroy();
            this.lightningFx = null;
          }
          return;
        }
        render();
      },
    });
  }
}
