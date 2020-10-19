import "phaser";
import { BoardScene } from "./board";
const config: GameConfig = {
  title: "Multiflood",
  width: 800,
  height: 600,
  scene: [BoardScene],
  parent: "game",
  backgroundColor: "#18216D"
};
export class MultifloodGame extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config);
  }
}
window.onload = () => {
  var game = new MultifloodGame(config);
};