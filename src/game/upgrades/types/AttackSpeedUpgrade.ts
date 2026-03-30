import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class AttackSpeedUpgrade extends BaseUpgrade {
  readonly id = 'attack_speed' as const;
  readonly maxStacks = 5;
  readonly title = 'Faster attacks';
  readonly description = '+12% attack speed';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.attackSpeedMult *= 1.12;
  }
}
