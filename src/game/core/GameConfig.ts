import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from '../utils/constants';
import { PreloadScene } from '../scenes/PreloadScene';
import { GameScene } from '../scenes/GameScene';
import { UIScene } from '../scenes/UIScene';

export function createGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: 0x12121a,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: [PreloadScene, GameScene, UIScene],
  };
}
