import type Phaser from 'phaser';

export function nearestEnemy(
  x: number,
  y: number,
  enemies: Phaser.GameObjects.Group,
): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
  let best: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  enemies.getChildren().forEach((obj) => {
    const e = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    if (!e.active || !e.body) return;
    const dx = e.x - x;
    const dy = e.y - y;
    const d = dx * dx + dy * dy;
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  });
  return best;
}

export function nearestEnemyExcluding(
  x: number,
  y: number,
  enemies: Phaser.GameObjects.Group,
  exclude: Set<Phaser.GameObjects.GameObject> | null,
  maxDistSq: number,
): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null {
  let best: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  enemies.getChildren().forEach((obj) => {
    const e = obj as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    if (!e.active || !e.body) return;
    if (exclude && exclude.has(e)) return;
    const dx = e.x - x;
    const dy = e.y - y;
    const d = dx * dx + dy * dy;
    if (d > maxDistSq) return;
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  });
  return best;
}

export function distanceSq(ax: number, ay: number, bx: number, by: number): number {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

export function lineCircleHit(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
  r: number,
): boolean {
  const abx = bx - ax;
  const aby = by - ay;
  const acx = cx - ax;
  const acy = cy - ay;
  const abLenSq = abx * abx + aby * aby;
  if (abLenSq < 1e-6) return distanceSq(ax, ay, cx, cy) <= r * r;
  let t = (acx * abx + acy * aby) / abLenSq;
  t = Math.max(0, Math.min(1, t));
  const px = ax + abx * t;
  const py = ay + aby * t;
  return distanceSq(px, py, cx, cy) <= r * r;
}

/** First intersection of ray (ox,oy)+t*(cos(angle),sin(angle)), t>0, with world AABB [0,w]×[0,h]. */
export function rayExitWorldBounds(
  ox: number,
  oy: number,
  angle: number,
  worldW: number,
  worldH: number,
): { x: number; y: number } {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let tMin = Infinity;
  const consider = (t: number): void => {
    if (t > 1e-6 && t < tMin) tMin = t;
  };
  if (Math.abs(dx) > 1e-8) {
    consider((0 - ox) / dx);
    consider((worldW - ox) / dx);
  }
  if (Math.abs(dy) > 1e-8) {
    consider((0 - oy) / dy);
    consider((worldH - oy) / dy);
  }
  if (!Number.isFinite(tMin) || tMin <= 0) {
    tMin = Math.max(worldW, worldH) * 2;
  }
  return { x: ox + dx * tMin, y: oy + dy * tMin };
}

/** Point outside axis-aligned rect centered at (px,py) with half-extents hw,hh, along ray angle (from center). */
export function pointOutsideRectAlongRay(
  px: number,
  py: number,
  hw: number,
  hh: number,
  angle: number,
  margin: number,
): { x: number; y: number } {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let tMin = Infinity;
  const consider = (t: number): void => {
    if (t > 1e-8 && t < tMin) tMin = t;
  };
  if (Math.abs(dx) > 1e-8) {
    consider(hw / dx);
    consider(-hw / dx);
  }
  if (Math.abs(dy) > 1e-8) {
    consider(hh / dy);
    consider(-hh / dy);
  }
  if (!Number.isFinite(tMin) || tMin <= 0) {
    tMin = Math.max(hw, hh);
  }
  const t = tMin + margin;
  return { x: px + dx * t, y: py + dy * t };
}
