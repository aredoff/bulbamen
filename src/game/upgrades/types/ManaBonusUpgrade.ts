import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class ManaBonusUpgrade extends BaseUpgrade {
  readonly id = 'mana_bonus' as const;
  readonly maxStacks = 5;
  readonly title = 'Rich mana';
  readonly description = 'Next 8 pickups grant +20% XP each';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.manaBonusOrbsRemaining += 8;
  }
}
