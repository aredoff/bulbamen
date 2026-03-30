import type { UpgradeId } from '../../core/types';
import { BaseUpgrade } from './BaseUpgrade';
import { HealUpgrade } from '../types/HealUpgrade';
import { AddWeaponUpgrade } from '../types/AddWeaponUpgrade';
import { WeaponBoostUpgrade } from '../types/WeaponBoostUpgrade';
import { AttackSpeedUpgrade } from '../types/AttackSpeedUpgrade';
import { MoveSpeedUpgrade } from '../types/MoveSpeedUpgrade';
import { EnemyReverseUpgrade } from '../types/EnemyReverseUpgrade';
import { RandomKillUpgrade } from '../types/RandomKillUpgrade';
import { DoubleShotUpgrade } from '../types/DoubleShotUpgrade';
import { ManaBonusUpgrade } from '../types/ManaBonusUpgrade';

export class UpgradeFactory {
  create(id: UpgradeId): BaseUpgrade {
    switch (id) {
      case 'heal_hp':
        return new HealUpgrade();
      case 'add_weapon':
        return new AddWeaponUpgrade();
      case 'weapon_boost':
        return new WeaponBoostUpgrade();
      case 'attack_speed':
        return new AttackSpeedUpgrade();
      case 'move_speed':
        return new MoveSpeedUpgrade();
      case 'enemy_reverse':
        return new EnemyReverseUpgrade();
      case 'random_kill':
        return new RandomKillUpgrade();
      case 'double_shot':
        return new DoubleShotUpgrade();
      case 'mana_bonus':
        return new ManaBonusUpgrade();
      default:
        return new HealUpgrade();
    }
  }

  allIds(): UpgradeId[] {
    return [
      'heal_hp',
      'add_weapon',
      'weapon_boost',
      'attack_speed',
      'move_speed',
      'enemy_reverse',
      'random_kill',
      'double_shot',
      'mana_bonus',
    ];
  }
}
