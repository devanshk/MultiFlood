import 'phaser';
import { SoloFlood, Square } from '../environments/solo_flood';

//
// Renders an interactive SoloFlood game
//

export class SoloFloodScene extends Phaser.Scene {
  env: SoloFlood;
  colors: Array<Phaser.Display.Color>;
  board_grid: Array<Array<Phaser.GameObjects.Rectangle>>;
  metrics: {
    steps: number;
    cumulative_reward: number;
  }
  score_text: Phaser.GameObjects.Text;

  init(params: any): void {
    const dimension = params.dimension ?? 7;
    const num_colors = params.num_colors ?? 4;
    this.env = new SoloFlood(dimension, num_colors);
    this.colors = Array(num_colors).fill(0).map(
      () => new Phaser.Display.Color().random()
    );
    this.metrics = {
      steps: 0,
      cumulative_reward: 0,
    };
  }

  create(): void {
    // Get a top-left point that centers the board
    const state = this.env.get_state();
    let { x: pos_x, y: pos_y } =
      this.getTopLeftPos(
        this.getCenter(),
        {
          width: state[0].length * 50,
          height: state.length * 50
        }
      );

    // Convert the game board into a grid of Phaser rectangles
    this.board_grid = state.map(
      (row: Array<Square>, i: number) =>
        row.map(
          (square: Square, j: number) =>
            this.add.rectangle(
              pos_x + i * 50 + 25,
              pos_y + j * 50 + 25,
              40,
              40,
            ).setInteractive().on('pointerdown', () => {
              let { reward } = this.env.step(square.color);
              this.metrics = {
                ...this.metrics,
                steps: this.metrics.steps + 1,
                cumulative_reward: this.metrics.cumulative_reward + reward
              }
              this.render();
            })
        )
    );

    this.score_text =
      this.add.text(
        10, this.cameras.main.height-180, '',
        {fontSize: 200, color:'rgba(255,255,255,0.1)', fontFamily: 'Courier New'}
      ).setAlpha(0); // remove setAlpha to show steps

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

    this.score_text.setText('' + this.metrics.steps);
  }

  private getTopLeftPos(
    center_pos: { x: number, y: number },
    dimensions: { width: number, height: number }
  ): { x: number, y: number } {
    return {
      x: center_pos.x - dimensions.width / 2,
      y: center_pos.y - dimensions.height / 2
    }
  }

  private getCenter(): { x: number, y: number } {
    console.log(this.cameras.main.width);
    return {
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY
    }
  }
}
