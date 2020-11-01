import "phaser";
import { BoardScene } from "./board";
const config: GameConfig = {
  title: "Multiflood",
  width: 800,
  height: 600,
  parent: "game",
  scene: [BoardScene],
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