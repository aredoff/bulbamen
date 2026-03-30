import type { PlayerStats } from '../player/PlayerStats';

export function tickEnemyReverse(stats: PlayerStats, delta: number): boolean {
  return stats.tickEnemyReverse(delta);
}
