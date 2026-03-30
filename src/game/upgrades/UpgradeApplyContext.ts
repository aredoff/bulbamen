import type { Player } from '../player/Player';
import type { WeaponManager } from '../weapons/WeaponManager';

export interface UpgradeApplyContext {
  player: Player;
  weaponManager: WeaponManager;
}
