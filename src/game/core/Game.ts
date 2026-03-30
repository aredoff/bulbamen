import Phaser from 'phaser';
import { createGameConfig } from './GameConfig';

export function createGame(): Phaser.Game {
  return new Phaser.Game(createGameConfig());
}
