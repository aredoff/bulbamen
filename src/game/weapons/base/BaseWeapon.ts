import type { WeaponType } from '../../core/types';
import type { WeaponContext } from '../WeaponContext';

export abstract class BaseWeapon {
  protected cooldownMs = 0;
  protected timer = 0;

  constructor(
    readonly weaponType: WeaponType,
    baseCooldown: number,
    protected level = 1,
  ) {
    this.cooldownMs = baseCooldown;
  }

  abstract tick(delta: number, ctx: WeaponContext): void;

  protected tryFire(delta: number, attackSpeedMult: number): boolean {
    this.timer += delta * attackSpeedMult;
    if (this.timer < this.cooldownMs) return false;
    this.timer -= this.cooldownMs;
    return true;
  }

  boostDamage(base: number, ctx: WeaponContext): number {
    return base * ctx.stats.weaponDamageMult * (1 + (this.level - 1) * 0.15);
  }

  boostLevel(): void {
    this.level += 1;
  }
}
