import "phaser";
import { BoardScene } from "./board";
import { SoloFloodScene } from './scenes/solo_flood_scene';

const config: GameConfig = {
  title: "Multiflood",
  width: 800,
  height: 600,
  parent: "game",
  scene: [SoloFloodScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};
export class MultifloodGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new MultifloodGame(config);
};
