import { Environment } from './environment';
import { Block } from './square';
import { Board } from './board';
import { Player } from './player';

//
// Two-Player Flood Environment
//

// Board of size dimension * dimension
// Stored as [[row 0][row 1]..]
type TState = Board;

// Player object wraps player number and color which represents the action taken
type TAction = Player;

export class Multiflood implements Environment<TState, TAction>{
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
      2
    );
    this.state.claim_block(0, 0, 0, -1);
    // Two players are started at the opposite ends of the board
    // TODO: Make sure board ends are unique
    this.state.claim_block(this.dimension-1, this.dimension-1, 1, -1);
    return JSON.parse(JSON.stringify(this.state.board));
  }

  step(
    action: TAction
  ): { state: TState, reward: number, done: boolean } {
    // Set all owned squares to the given color
    this.state.set_board(action.player_num, action.color)

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

  private floodFill(
    row: number, col: number, action: TAction, seen: Array<Array<boolean>>
  ): number {
    if (row < 0 || row >= this.state.board.length) { return 0; }
    if (col < 0 || col >= this.state.board[0].length) { return 0; }
    if (seen[row][col]) { return 0; }
    if (this.state.get_block(row, col).color !== action.color) { return 0; }
    if (this.state.get_block(row, col).owning_player !== action.player_num) { return 0; }

    seen[row][col] = true;
    let reward = 0;
    if (this.state.board[row][col].color == action.color) {
      let was_unowned = !(this.state.get_block(row, col).owning_player >= 0);
      this.state.claim_block(row, col, action.player_num, action.color);
      reward = was_unowned ? this.SQUARE_CLAIM_REWARD : 0;
    }

    reward += this.floodFill(row - 1, col, action, seen);
    reward += this.floodFill(row + 1, col, action, seen);
    reward += this.floodFill(row, col - 1, action, seen);
    reward += this.floodFill(row, col + 1, action, seen);

    return reward;
  }
}

export { Block } from './square';
export { Board } from './board';
