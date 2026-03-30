import type { BaseEnemy } from '../enemies/base/BaseEnemy';

export class DamageSystem {
  damageEnemy(enemy: BaseEnemy, amount: number): void {
    enemy.takeDamage(amount);
  }
}
