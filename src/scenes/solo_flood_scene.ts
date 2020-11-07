import 'phaser';
import { SoloFlood, Square } from '../environments/solo_flood';

//
// Renders an interactive SoloFlood game
//

export class SoloFloodScene extends Phaser.Scene {
  grid: Phaser.GameObjects.Grid;
  env: SoloFlood;
  colors: Array<Phaser.Display.Color>;
  board_grid: Array<Array<Phaser.GameObjects.Rectangle>>;

  init(params: any): void {
    const dimension = params.dimension ?? 5;
    const num_colors = params.num_colors ?? 4;
    this.env = new SoloFlood(dimension, num_colors);
    this.colors = Array(num_colors).fill(0).map(
      () => new Phaser.Display.Color().random()
    );
  }

  create(): void {
    let pos_x = 300;
    let pos_y = 200;

    // Convert the game board into a grid of Phaser rectangles
    const state = this.env.get_state();
    this.board_grid = state.map(
      (row: Array<Square>, i: number) =>
        row.map(
          (square: Square, j: number) =>
            this.add.rectangle(
              pos_x + i * 50,
              pos_y + j * 50,
              40,
              40,
            ).setInteractive().on('pointerdown', () => {
              let { reward } = this.env.step(square.color);
              console.log(reward);
              this.render();
            })
        )
    );

    this.render();
  }

  private render(): void {
    const state = this.env.get_state();
    this.board_grid.forEach(
      (row: Array<Phaser.GameObjects.Rectangle>, i: number) =>
        row.forEach(
          (rect: Phaser.GameObjects.Rectangle, j: number) =>
            rect.setFillStyle(this.colors[state[i][j].color].color)
              .setStrokeStyle(5, 0xffffff, state[i][j].owned ? 1 : 0)
        )
    );
  }
}
