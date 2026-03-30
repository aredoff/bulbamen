import Phaser from 'phaser';
import { WeaponType } from '../../core/types';
import { WEAPON_CONFIG } from '../../config/weapons';
import { BaseWeapon } from '../base/BaseWeapon';
import type { WeaponContext } from '../WeaponContext';
import { nearestEnemy } from '../../utils/math';
import { Rocket } from '../../combat/Rocket';

export class RocketWeapon extends BaseWeapon {
  constructor(level = 1) {
    super(WeaponType.Rocket, WEAPON_CONFIG[WeaponType.Rocket].baseCooldownMs, level);
  }

  tick(delta: number, ctx: WeaponContext): void {
    const cfg = WEAPON_CONFIG[WeaponType.Rocket];
    this.cooldownMs = cfg.baseCooldownMs;
    if (!this.tryFire(delta, ctx.stats.effectiveAttackSpeedMult)) return;
    const target = nearestEnemy(ctx.player.x, ctx.player.y, ctx.enemies);
    if (!target) {
      this.timer += this.cooldownMs * 0.6;
      return;
    }
    const angle = Phaser.Math.Angle.Between(
      ctx.player.x,
      ctx.player.y,
      target.x,
      target.y,
    );
    const speed = cfg.rocketSpeed ?? 260;
    const dmg = this.boostDamage(cfg.damage, ctx);
    const radius = cfg.rocketRadius ?? 100;
    const r = new Rocket(
      ctx.scene,
      ctx.player.x,
      ctx.player.y,
      'rocket',
      angle,
      speed,
      dmg,
      radius,
    );
    ctx.rocketGroup.add(r);
    r.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
  }
}
