import type { UpgradeId } from '../core/types';
import { UpgradeFactory } from './base/UpgradeFactory';
import type { BaseUpgrade } from './base/BaseUpgrade';
import { UPGRADE_WEIGHTS } from '../config/upgrades';

export class UpgradeManager {
  private readonly stacks = new Map<UpgradeId, number>();
  private readonly factory = new UpgradeFactory();

  getStack(id: UpgradeId): number {
    return this.stacks.get(id) ?? 0;
  }

  canTake(id: UpgradeId, maxStacks: number): boolean {
    return this.getStack(id) < maxStacks;
  }

  recordTake(id: UpgradeId): void {
    this.stacks.set(id, this.getStack(id) + 1);
  }

  rollThree(): BaseUpgrade[] {
    const pool = this.factory.allIds().filter((id) => {
      const u = this.factory.create(id);
      return this.canTake(id, u.maxStacks);
    });
    if (pool.length === 0) {
      return [];
    }
    const picked: BaseUpgrade[] = [];
    const remaining = [...pool];
    while (picked.length < 3 && remaining.length > 0) {
      const total = remaining.reduce((s, id) => s + (UPGRADE_WEIGHTS[id] ?? 1), 0);
      let r = Math.random() * total;
      let chosenIdx = remaining.length - 1;
      for (let i = 0; i < remaining.length; i++) {
        const id = remaining[i]!;
        const w = UPGRADE_WEIGHTS[id] ?? 1;
        r -= w;
        if (r <= 0) {
          chosenIdx = i;
          break;
        }
      }
      const id = remaining.splice(chosenIdx, 1)[0]!;
      picked.push(this.factory.create(id));
    }
    return picked;
  }
}
