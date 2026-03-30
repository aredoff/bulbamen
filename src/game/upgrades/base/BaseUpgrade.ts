import type { UpgradeId } from '../../core/types';
import type { UpgradeApplyContext } from '../UpgradeApplyContext';

export abstract class BaseUpgrade {
  abstract readonly id: UpgradeId;
  abstract readonly maxStacks: number;
  abstract readonly title: string;
  abstract readonly description: string;
  abstract apply(ctx: UpgradeApplyContext): void;
}
