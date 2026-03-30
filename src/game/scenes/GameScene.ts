import Phaser from 'phaser';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../utils/constants';
import { SPAWN_BASE_MS, SPAWN_MIN_MS } from '../utils/constants';
import { Player } from '../player/Player';
import { PlayerController } from '../player/PlayerController';
import { EnemyManager } from '../enemies/EnemyManager';
import { WeaponManager } from '../weapons/WeaponManager';
import { DamageSystem } from '../combat/DamageSystem';
import { XPManager } from '../xp/XPManager';
import { LevelManager } from '../xp/LevelManager';
import { UpgradeManager } from '../upgrades/UpgradeManager';
import { UpgradeFactory } from '../upgrades/base/UpgradeFactory';
import type { UpgradeId } from '../core/types';
import { CollisionSystem } from '../systems/CollisionSystem';
import { ParticleSystem } from '../systems/ParticleSystem';
import { tickEnemyReverse } from '../systems/MovementSystem';
import type { WeaponContext } from '../weapons/WeaponContext';
import type { BaseEnemy } from '../enemies/base/BaseEnemy';
import { Rocket } from '../combat/Rocket';
import type { EnemyType } from '../core/types';
import { SCORE_PER_ENEMY } from '../config/score';

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private controller!: PlayerController;
  private enemyManager!: EnemyManager;
  private weaponManager!: WeaponManager;
  private xpManager!: XPManager;
  private levelManager!: LevelManager;
  private upgradeManager!: UpgradeManager;
  private upgradeFactory = new UpgradeFactory();
  private damageSystem!: DamageSystem;
  private collision!: CollisionSystem;
  private particles!: ParticleSystem;
  private bullets!: Phaser.Physics.Arcade.Group;
  private rockets!: Phaser.Physics.Arcade.Group;
  private enemyBullets!: Phaser.Physics.Arcade.Group;
  private laserGraphics!: Phaser.GameObjects.Graphics;
  private auraGraphics!: Phaser.GameObjects.Graphics;
  private lightningGraphics!: Phaser.GameObjects.Graphics;
  private spawnAcc = 0;
  private spawnInterval = SPAWN_BASE_MS;
  private weaponCtx!: WeaponContext;
  private deadEventSent = false;
  private score = 0;

  constructor() {
    super({ key: 'Game' });
  }

  create(): void {
    this.deadEventSent = false;
    this.spawnInterval = SPAWN_BASE_MS;
    this.physics.resume();
    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.damageSystem = new DamageSystem();
    this.collision = new CollisionSystem();
    this.particles = new ParticleSystem();
    this.upgradeManager = new UpgradeManager();

    this.bullets = this.physics.add.group();
    this.rockets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();

    this.player = new Player(this, WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player');
    const pb = this.player.body as Phaser.Physics.Arcade.Body;
    pb.setSize(18, 18);

    this.enemyManager = new EnemyManager(this, this.player, this.enemyBullets);
    this.xpManager = new XPManager(this, this.player, 'orb');
    this.levelManager = new LevelManager(this);
    this.weaponManager = new WeaponManager();
    this.weaponManager.resetWithStarter();

    this.laserGraphics = this.add.graphics();
    this.laserGraphics.setDepth(12);
    this.auraGraphics = this.add.graphics();
    this.auraGraphics.setDepth(11);
    this.lightningGraphics = this.add.graphics();
    this.lightningGraphics.setDepth(13);

    this.weaponCtx = {
      scene: this,
      player: this.player,
      enemies: this.enemyManager.group,
      bulletGroup: this.bullets,
      rocketGroup: this.rockets,
      damageSystem: this.damageSystem,
      stats: this.player.stats,
      registerProjectileShot: () => {
        this.player.stats.projectileShotIndex += 1;
      },
      laserGraphics: this.laserGraphics,
      auraGraphics: this.auraGraphics,
      lightningGraphics: this.lightningGraphics,
    };

    this.controller = new PlayerController(this, this.player);

    this.collision.setup(
      this,
      this.player,
      this.enemyManager.group,
      this.bullets,
      this.rockets,
      this.enemyBullets,
      this.xpManager,
      this.levelManager,
      this.particles,
    );

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.events.on('player-level-up', () => {
      const choices = this.upgradeManager.rollThree();
      if (choices.length === 0) return;
      this.scene.pause('Game');
      this.game.events.emit('show-upgrade-picker', { choices });
    });

    this.game.events.on('upgrade-picked', this.onUpgradePicked, this);

    this.events.on(
      'enemy-died',
      (payload: { x: number; y: number; type: EnemyType }) => {
        this.particles.burst(this, payload.x, payload.y, 0xff6b6b, 10);
        const add = SCORE_PER_ENEMY[payload.type] ?? 10;
        this.score += add;
        this.game.registry.set('score', this.score);
      },
    );

    this.events.on('random-kill-proc', (p: { x: number; y: number }) => {
      this.particles.burst(this, p.x, p.y, 0xffdd66, 5);
    });

    this.spawnAcc = 0;

    this.score = 0;
    this.game.registry.set('score', 0);
    this.game.registry.set('playerStats', this.player.stats);
    this.game.registry.set('levelManager', this.levelManager);

    this.events.once('shutdown', () => {
      this.game.events.off('upgrade-picked', this.onUpgradePicked, this);
    });
  }

  private onUpgradePicked(data: { id: UpgradeId }): void {
    const u = this.upgradeFactory.create(data.id);
    u.apply({ player: this.player, weaponManager: this.weaponManager });
    this.upgradeManager.recordTake(data.id);
    this.scene.resume('Game');
  }

  update(_time: number, delta: number): void {
    if (!this.player.active) return;
    if (this.deadEventSent) return;
    this.controller.update();

    const inverted = tickEnemyReverse(this.player.stats, delta);
    this.enemyManager.tick(
      delta,
      this.player,
      inverted,
      'enemy_bullet',
      this.player.stats.randomKillChance,
    );

    this.spawnAcc += delta;
    if (this.spawnAcc >= this.spawnInterval) {
      this.spawnAcc = 0;
      this.enemyManager.spawnRandom();
      this.spawnInterval = Math.max(
        SPAWN_MIN_MS,
        this.spawnInterval - 1.2,
      );
    }

    this.weaponManager.tick(delta, this.weaponCtx);

    this.physics.overlap(this.player, this.enemyManager.group, (_p, e) => {
      const enemy = e as BaseEnemy;
      this.player.takeDamage(enemy.contactDamage * (delta / 1000));
    });

    this.cleanupOffscreen();
    this.boundsRockets();

    if (this.player.isDead()) {
      this.physics.pause();
      this.deadEventSent = true;
      this.game.events.emit('player-dead');
    }
  }

  private boundsRockets(): void {
    this.rockets.getChildren().forEach((obj) => {
      const r = obj as Rocket;
      if (!r.active) return;
      const b = this.physics.world.bounds;
      const right = b.x + b.width;
      const bottom = b.y + b.height;
      if (
        r.x < b.x - 40 ||
        r.x > right + 40 ||
        r.y < b.y - 40 ||
        r.y > bottom + 40
      ) {
        r.destroy();
      }
    });
  }

  private cleanupOffscreen(): void {
    const b = this.physics.world.bounds;
    const right = b.x + b.width;
    const bottom = b.y + b.height;
    const pad = 80;
    const kill = (obj: Phaser.GameObjects.GameObject): void => {
      const s = obj as Phaser.Physics.Arcade.Sprite;
      if (!s.active) return;
      if (
        s.x < b.x - pad ||
        s.x > right + pad ||
        s.y < b.y - pad ||
        s.y > bottom + pad
      ) {
        s.destroy();
      }
    };
    this.bullets.getChildren().forEach((o) => kill(o));
    this.enemyBullets.getChildren().forEach((o) => kill(o));
  }
}
