import { WeaponType } from '../core/types';
import { START_WEAPON } from '../config/weapons';
import { MAX_WEAPONS } from '../utils/constants';
import { WeaponFactory } from './base/WeaponFactory';
import type { BaseWeapon } from './base/BaseWeapon';
import type { WeaponContext } from './WeaponContext';

export class WeaponManager {
  private readonly weapons: BaseWeapon[] = [];
  private readonly factory = new WeaponFactory();

  get activeTypes(): WeaponType[] {
    return this.weapons.map((w) => w.weaponType);
  }

  addWeapon(type: WeaponType): boolean {
    if (this.weapons.length >= MAX_WEAPONS) return false;
    if (this.weapons.some((w) => w.weaponType === type)) return false;
    this.weapons.push(this.factory.create(type, 1));
    return true;
  }

  boostRandomWeapon(): boolean {
    if (this.weapons.length === 0) return false;
    const w = this.weapons[Math.floor(Math.random() * this.weapons.length)]!;
    w.boostLevel();
    return true;
  }

  tick(delta: number, ctx: WeaponContext): void {
    for (const w of this.weapons) {
      w.tick(delta, ctx);
    }
  }

  resetWithStarter(): void {
    this.weapons.length = 0;
    this.weapons.push(this.factory.create(START_WEAPON, 1));
  }
}
