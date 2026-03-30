import { WeaponType } from '../../core/types';
import type { BaseWeapon } from './BaseWeapon';
import { ProjectileWeapon } from '../types/ProjectileWeapon';
import { LaserWeapon } from '../types/LaserWeapon';
import { RocketWeapon } from '../types/RocketWeapon';
import { AuraWeapon } from '../types/AuraWeapon';
import { LightningWeapon } from '../types/LightningWeapon';

export class WeaponFactory {
  create(type: WeaponType, level = 1): BaseWeapon {
    switch (type) {
      case WeaponType.Projectile:
        return new ProjectileWeapon(level);
      case WeaponType.Laser:
        return new LaserWeapon(level);
      case WeaponType.Rocket:
        return new RocketWeapon(level);
      case WeaponType.Aura:
        return new AuraWeapon(level);
      case WeaponType.Lightning:
        return new LightningWeapon(level);
      default:
        return new ProjectileWeapon(level);
    }
  }
}
