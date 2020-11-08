import { Environment } from './environment';
import { TensorflowEnvTrait } from './tensorflow_env_trait';
import * as tf from '@tensorflow/tfjs';
import { flatten } from 'lodash';
//
// One-player Flood Environment
//

// Board of size dimension * dimension
// Stored as [[row 0][row 1]..]
export type TState = Array<Array<Square>>;

// Tensorflow state type
export type TTFState = tf.Tensor1D;

// An action is just a number (color) to change your owned squares to
export type TAction = number

export class SoloFlood implements Environment<TState, TAction> {
  private state: TState;

  SQUARE_CLAIM_REWARD = 1;
  GAME_FINISH_REWARD = 5;

  constructor(
    private dimension: number,
    private num_colors: number,
  ) {
    this.reset();
  }

  // TODO: Replace this with StateAdapters
  // Currently only exports colors, TODO: add ownership info
  stateToTensor(state: TState): TTFState {
    return tf.tensor(flatten(state).map((x: Square) => x.color));
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
    this.state = Array(this.dimension).fill(0).map(
      () => Array(this.dimension).fill(0).map(
        () => new Square(Math.floor(Math.random() * this.num_colors))
      )
    )
    this.state[0][0].owned = true;
    return JSON.parse(JSON.stringify(this.state));
  }

  step(action: TAction): { state: TState, reward: number, done: boolean } {
    // Set all owned squares to the given color
    [].concat.apply([], this.state).forEach(
      (square: Square) => square.owned ? square.color = action : {}
    );

    // Create an all-false visited array then flood-claim from (0,0)
    let false_board = this.state.map((row) => row.map(() => false));
    let reward = this.floodFill(0, 0, action, false_board);

    // The game is over if all squares are owned
    const done = [].concat.apply([], this.state)
      .find((square: Square) => !square.owned) === undefined;

    // and we get a bonus reward for finishing the game
    reward += done ? this.GAME_FINISH_REWARD : 0;

    return {
      state: JSON.parse(JSON.stringify(this.state)),
      reward: reward,
      done: done,
    }
  }

  private floodFill(row: number, col: number, color: number, seen: Array<Array<boolean>>): number {
    if (row < 0 || row >= this.state.length) { return 0; }
    if (col < 0 || col >= this.state[0].length) { return 0; }
    if (seen[row][col]) { return 0; }
    seen[row][col] = true;
    if (this.state[row][col].color !== color) { return 0; }

    let reward = 0;
    if (this.state[row][col].color == color) {
      let was_unowned = !this.state[row][col].owned;
      this.state[row][col].owned = true;
      reward = was_unowned ? this.SQUARE_CLAIM_REWARD : 0;
    }

    reward += this.floodFill(row - 1, col, color, seen);
    reward += this.floodFill(row + 1, col, color, seen);
    reward += this.floodFill(row, col - 1, color, seen);
    reward += this.floodFill(row, col + 1, color, seen);

    return reward;
  }
}

export class Square {
  owned: boolean

  constructor(
    public color: number,
  ) { }
}
