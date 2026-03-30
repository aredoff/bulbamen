import { BaseUpgrade } from '../base/BaseUpgrade';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export class MoveSpeedUpgrade extends BaseUpgrade {
  readonly id = 'move_speed' as const;
  readonly maxStacks = 5;
  readonly title = 'Swift feet';
  readonly description = '+8% movement speed';

  apply(ctx: UpgradeApplyContext): void {
    ctx.player.stats.moveSpeedMult *= 1.08;
  }
}
