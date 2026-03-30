import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class DoubleShotUpgrade extends BaseUpgrade {
  readonly id = 'double_shot' as const;
  readonly maxStacks = 3;
  readonly title = 'Triple rhythm';
  readonly description = 'Every 3rd projectile shot fires an extra bullet';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.doubleShotStacks += 1;
  }
}
