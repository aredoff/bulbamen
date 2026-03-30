import type { UpgradeId } from '../core/types';

export const UPGRADE_WEIGHTS: Record<UpgradeId, number> = {
  heal_hp: 1.1,
  add_weapon: 1.2,
  weapon_boost: 1.2,
  attack_speed: 1.15,
  move_speed: 1.1,
  enemy_reverse: 0.65,
  random_kill: 0.75,
  double_shot: 0.85,
  mana_bonus: 1,
};
