import Phaser from 'phaser';
import type { Player } from '../player/Player';

export function spawnPointOutsideCamera(
  scene: Phaser.Scene,
  player: Player,
  extra = 120,
): { x: number; y: number } {
  const cam = scene.cameras.main;
  const cx = player.x;
  const cy = player.y;
  const angle = Math.random() * Math.PI * 2;
  const halfW = cam.width / 2 + extra;
  const halfH = cam.height / 2 + extra;
  const dist = Math.max(halfW, halfH) + Math.random() * 180;
  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
  };
}

export function clampToWorld(
  scene: Phaser.Scene,
  x: number,
  y: number,
): { x: number; y: number } {
  const { width, height } = scene.physics.world.bounds;
  const pad = 40;
  return {
    x: Phaser.Math.Clamp(x, pad, width - pad),
    y: Phaser.Math.Clamp(y, pad, height - pad),
  };
}
