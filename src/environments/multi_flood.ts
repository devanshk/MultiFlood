import { Environment } from './environment';
import { Block } from './square';
import { Board } from './board'

//
// Multiplayer Flood Environment
//

export type TState = Board;

// An action is just a number (color) to change your owned squares to
export type TAction = number

export class MultiFlood implements Environment<TState, TAction>{
  private state: TState;

  SQUARE_CLAIM_REWARD = 1;
  GAME_FINISH_REWARD = 5;

  constructor(
    private dimension: number,
    private num_colors: number,
  ) {
    this.reset();
  }

  get_state() {
    return JSON.parse(JSON.stringify(this.state));
  }

  action_space() {
    return this.num_colors;
  }

  state_space() {
    return this.dimension ** 2;
  }

  reset() {
    this.state = new Board(
      this.dimension,
      this.num_colors,
      1
    );
    this.state.claim_block(0, 0, 0, -1);
    return JSON.parse(JSON.stringify(this.state.board));
  }

  step(action: TAction): { state: TState, reward: number, done: boolean } {
    // Set all owned squares to the given color
    this.state.set_board(0, action)

    // Create an all-false visited array then flood-claim from (0,0)
    let false_board = this.state.board.map((row) => row.map(() => false));
    let reward = this.floodFill(0, 0, action, false_board);

    // The game is over if all squares are owned
    const done = [].concat.apply([], this.state.board)
      .find((square: Block) => square.owning_player >= 0) === undefined;

    // and we get a bonus reward for finishing the game
    reward += done ? this.GAME_FINISH_REWARD : 0;

    return {
      state: JSON.parse(JSON.stringify(this.state.board)),
      reward: reward,
      done: done,
    }
  }

  private floodFill(row: number, col: number, color: number, seen: Array<Array<boolean>>): number {
    if (row < 0 || row >= this.state.board.length) { return 0; }
    if (col < 0 || col >= this.state.board[0].length) { return 0; }
    if (seen[row][col]) { return 0; }
    if (this.state.get_block(row, col).color !== color) { return 0; }

    seen[row][col] = true;
    let reward = 0;
    if (this.state.board[row][col].color == color) {
      let was_unowned = !(this.state.get_block(row, col).owning_player >= 0);
      this.state.claim_block(row, col, 0, color);
      reward = was_unowned ? this.SQUARE_CLAIM_REWARD : 0;
    }

    reward += this.floodFill(row - 1, col, color, seen);
    reward += this.floodFill(row + 1, col, color, seen);
    reward += this.floodFill(row, col - 1, color, seen);
    reward += this.floodFill(row, col + 1, color, seen);

    return reward;
  }
}

export { Block } from './square';
export { Board } from './board';
