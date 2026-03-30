import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class EnemyReverseUpgrade extends BaseUpgrade {
  readonly id = 'enemy_reverse' as const;
  readonly maxStacks = 3;
  readonly title = 'Confusion pulse';
  readonly description = 'Every 10s enemies flee for 2s (stack increases frequency feel)';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.enemyReverseStacks += 1;
  }
}
