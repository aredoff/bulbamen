import Phaser from 'phaser';
import { WeaponType } from '../../core/types';
import { WEAPON_CONFIG } from '../../config/weapons';
import { BaseWeapon } from '../base/BaseWeapon';
import type { WeaponContext } from '../WeaponContext';
import { nearestEnemy } from '../../utils/math';
import { Bullet } from '../../combat/Bullet';

const BULLET_SPEED = 520;
const MUZZLE_OFFSET = 28;

export class ProjectileWeapon extends BaseWeapon {
  constructor(level = 1) {
    super(WeaponType.Projectile, WEAPON_CONFIG[WeaponType.Projectile].baseCooldownMs, level);
  }

  tick(delta: number, ctx: WeaponContext): void {
    const cfg = WEAPON_CONFIG[WeaponType.Projectile];
    this.cooldownMs = cfg.baseCooldownMs;
    if (!this.tryFire(delta, ctx.stats.effectiveAttackSpeedMult)) return;
    const target = nearestEnemy(ctx.player.x, ctx.player.y, ctx.enemies);
    if (!target) {
      this.timer += this.cooldownMs * 0.85;
      return;
    }
    const angle = Phaser.Math.Angle.Between(
      ctx.player.x,
      ctx.player.y,
      target.x,
      target.y,
    );
    const dmg = this.boostDamage(cfg.damage, ctx);
    const pierce = 0;
    const baseX = ctx.player.x + Math.cos(angle) * MUZZLE_OFFSET;
    const baseY = ctx.player.y + Math.sin(angle) * MUZZLE_OFFSET;
    const spawn = (ox: number, oy: number, a: number): void => {
      const b = new Bullet(
        ctx.scene,
        baseX + ox,
        baseY + oy,
        'bullet',
        a,
        BULLET_SPEED,
        dmg,
        pierce,
      );
      ctx.bulletGroup.add(b);
      const vx = Math.cos(a) * BULLET_SPEED;
      const vy = Math.sin(a) * BULLET_SPEED;
      b.setVelocity(vx, vy);
    };
    spawn(0, 0, angle);
    ctx.registerProjectileShot();
    if (ctx.stats.doubleShotStacks > 0 && ctx.stats.projectileShotIndex > 0 && ctx.stats.projectileShotIndex % 3 === 0) {
      spawn(Math.cos(angle + 0.12) * 6, Math.sin(angle + 0.12) * 6, angle);
    }
  }
}
