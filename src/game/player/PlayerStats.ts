export class PlayerStats {
  hp = 100;
  maxHp = 100;
  baseMoveSpeed = 220;
  moveSpeedMult = 1;
  attackSpeedMult = 1;
  weaponDamageMult = 1;
  manaBonusOrbsRemaining = 0;
  projectileShotIndex = 0;
  randomKillChance = 0;
  doubleShotStacks = 0;
  enemyReverseStacks = 0;

  private revActive = false;
  private revT = 0;
  private cycleT = 0;

  get moveSpeed(): number {
    return this.baseMoveSpeed * this.moveSpeedMult;
  }

  get effectiveAttackSpeedMult(): number {
    return this.attackSpeedMult;
  }

  takeDamage(amount: number): void {
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
  }

  healPercentOfMax(pct: number): void {
    const add = this.maxHp * pct;
    this.hp = Math.min(this.maxHp, this.hp + add);
  }

  addMaxHpPercent(pct: number): void {
    const before = this.maxHp;
    this.maxHp *= 1 + pct;
    const ratio = before > 0 ? this.hp / before : 1;
    this.hp = Math.min(this.maxHp, ratio * this.maxHp);
  }

  tickEnemyReverse(delta: number): boolean {
    if (this.enemyReverseStacks <= 0) {
      this.revActive = false;
      this.cycleT = 0;
      return false;
    }
    if (this.revActive) {
      this.revT -= delta;
      if (this.revT <= 0) this.revActive = false;
      return true;
    }
    this.cycleT += delta;
    if (this.cycleT >= 10000) {
      this.cycleT = 0;
      this.revActive = true;
      this.revT = 2000;
      return true;
    }
    return false;
  }
}
