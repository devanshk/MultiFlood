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

export class DQNAgent<TState, TAction> implements RLAgent<TState, TAction>{
  params: TParams;
  model: tf.Sequential;

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

    this.model = this.build_model();
  }

  act(state: TState): TAction {

  }

  remember: (state: any, action: any, reward: number, next_state: any, done: boolean) => void;
  replay: () => void;

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
