import "phaser";
import { SoloFloodScene } from './scenes/solo_flood_scene';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const config: GameConfig = {
  title: "Multiflood",
  width: screenWidth - 16,
  height: screenHeight - 16,
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
