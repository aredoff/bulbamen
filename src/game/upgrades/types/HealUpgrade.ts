import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class HealUpgrade extends BaseUpgrade {
  readonly id = 'heal_hp' as const;
  readonly maxStacks = 3;
  readonly title = 'Vitality';
  readonly description = '+50% max HP (heals proportionally)';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.addMaxHpPercent(0.5);
  }
}
