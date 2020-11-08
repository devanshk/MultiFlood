import { RLAgent } from './rl_agent';
import * as tf from '@tensorflow/tfjs';

type TParams = {
  state_space: number,
  action_space: number,
  name?: string,
  epsilon?: number,
  gamma?: number,
  batch_size?: number,
  epsilon_min?: number,
  epsilon_decay?: number,
  learning_rate?: number,
  layer_sizes?: Array<number>,
}

// Currently uses number as TAction for easy random action sampling.
// TODO: make this a generic that gets passed in
type TAction = number;

export class DQNAgent<TState> implements RLAgent<TState, TAction>{
  params: TParams;
  model: tf.Sequential;
  memory: Array<{
    state: TState,
    action: TAction,
    reward: number,
    next_state: TState,
    done: boolean
  }>

  constructor(
    params: TParams
  ) {
    this.params = {
      name: 'GenericDQN',
      epsilon: 1,
      gamma: .95,
      batch_size: 500,
      epsilon_min: .01,
      epsilon_decay: .995,
      learning_rate: 0.00025,
      layer_sizes: [128, 128, 128],
      ...params
    }
    this.memory = [];
    this.model = this.build_model();
  }

  act(state: TState): TAction {
    if (Math.random() <= this.params.epsilon) {
      return Math.floor(Math.random() * this.params.action_space);
    }
    let action_values = this.model.predict(state);
    return tf.argMax(action_values[0]);
  }

  remember(state: any, action: any, reward: number, next_state: any, done: boolean): void {
    this.memory.push(
      { state, action, reward, next_state, done }
    );
  }

  replay(): void {
    if (this.memory.length < this.params.batch_size) { return; }

    let minibatch = tf.randomUniform(this.memory);
  }

  private build_model() {
    let model = tf.sequential();
    this.params.layer_sizes.forEach((size, i: number) =>
      i === 0 ?
        model.add(tf.layers.dense({
          units: size,
          inputDim: this.params.state_space,
          activation: 'relu'
        })) :
        model.add(tf.layers.dense({
          units: size,
          activation: 'relu'
        }))
    )
    model.add(tf.layers.dense({
      units: this.params.action_space,
      activation: 'softmax'
    }))

    model.compile({
      optimizer: tf.train.adam(this.params.learning_rate),
      loss: 'mse'
    });

    return model;
  }
}
