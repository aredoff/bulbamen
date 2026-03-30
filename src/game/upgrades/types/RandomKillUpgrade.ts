import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class RandomKillUpgrade extends BaseUpgrade {
  readonly id = 'random_kill' as const;
  readonly maxStacks = 5;
  readonly title = 'Entropy';
  readonly description = '+0.2% per second hazard per enemy (stacks)';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.randomKillChance += 0.002;
  }
}
