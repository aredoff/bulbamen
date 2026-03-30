import Phaser from 'phaser';
import { WeaponType } from '../../core/types';
import { WEAPON_CONFIG } from '../../config/weapons';
import { BaseWeapon } from '../base/BaseWeapon';
import type { WeaponContext } from '../WeaponContext';
import type { BaseEnemy } from '../../enemies/base/BaseEnemy';

export class AuraWeapon extends BaseWeapon {
  private auraTimer = 0;

  constructor(level = 1) {
    super(WeaponType.Aura, WEAPON_CONFIG[WeaponType.Aura].auraTickMs ?? 400, level);
  }

  tick(delta: number, ctx: WeaponContext): void {
    const cfg = WEAPON_CONFIG[WeaponType.Aura];
    const tickMs = cfg.auraTickMs ?? 420;
    this.cooldownMs = tickMs;
    this.auraTimer += delta * ctx.stats.effectiveAttackSpeedMult;
    if (this.auraTimer < tickMs) return;
    this.auraTimer -= tickMs;
    const radius = cfg.auraRadius ?? 95;
    const dmg = this.boostDamage(cfg.damage, ctx);
    const g = ctx.auraGraphics;
    g.clear();
    g.lineStyle(2, 0x54a0ff, 0.5);
    g.strokeCircle(ctx.player.x, ctx.player.y, radius);
    ctx.scene.time.delayedCall(120, () => {
      g.clear();
    });
    ctx.enemies.getChildren().forEach((obj) => {
      const e = obj as BaseEnemy;
      if (!e.active) return;
      const d = Phaser.Math.Distance.Between(ctx.player.x, ctx.player.y, e.x, e.y);
      if (d <= radius + e.width * 0.25) {
        e.takeDamage(dmg);
      }
    });
  }
}
