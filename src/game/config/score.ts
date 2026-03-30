import { EnemyType } from '../core/types';

export const SCORE_PER_ENEMY: Record<EnemyType, number> = {
  [EnemyType.Basic]: 10,
  [EnemyType.Fast]: 14,
  [EnemyType.Tank]: 40,
  [EnemyType.Shooter]: 22,
};
