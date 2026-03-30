import { WeaponType } from '../../core/types';
import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';
import { pickRandom } from '../../utils/random';

const POOL: WeaponType[] = [
  WeaponType.Projectile,
  WeaponType.Laser,
  WeaponType.Rocket,
  WeaponType.Aura,
  WeaponType.Lightning,
];

export class AddWeaponUpgrade extends BaseUpgrade {
  readonly id = 'add_weapon' as const;
  readonly maxStacks = 5;
  readonly title = 'New weapon';
  readonly description = 'Add a random weapon you do not have';

  apply(ctx: UpgradeApplyContext): void {
    const have = new Set(ctx.weaponManager.activeTypes);
    const avail = POOL.filter((t) => !have.has(t));
    if (avail.length === 0) {
      ctx.weaponManager.boostRandomWeapon();
      return;
    }
    ctx.weaponManager.addWeapon(pickRandom(avail));
  }
}
