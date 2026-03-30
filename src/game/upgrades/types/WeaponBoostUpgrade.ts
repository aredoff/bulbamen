import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class WeaponBoostUpgrade extends BaseUpgrade {
  readonly id = 'weapon_boost' as const;
  readonly maxStacks = 5;
  readonly title = 'Weapon upgrade';
  readonly description = 'Upgrade a random weapon level';

  apply(ctx: UpgradeApplyContext): void {
    ctx.weaponManager.boostRandomWeapon();
  }
}
