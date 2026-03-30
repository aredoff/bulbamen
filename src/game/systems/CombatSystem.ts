import type { DamageSystem } from '../combat/DamageSystem';

export class CombatSystem {
  constructor(private readonly damage: DamageSystem) {}

  get damageSystem(): DamageSystem {
    return this.damage;
  }
}
