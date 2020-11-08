import { RLAgent } from './rl_agent';
import * as tf from '@tensorflow/tfjs';
import { Memory } from '../data_structures/memory';

type TParams = {
  state_space: number,
  action_space: number,
  name?: string,
  epsilon?: number,
  gamma?: number,
  memory_size?: number,
  batch_size?: number,
  epsilon_min?: number,
  epsilon_decay?: number,
  learning_rate?: number,
  layer_sizes?: Array<number>,
}

// Currently uses number as TAction for easy random action sampling.
// TODO: make this a generic that gets passed in
type TAction = number;

type TMem<TState> = {
  state: TState,
  action: TAction,
  reward: number,
  next_state: TState,
  done: boolean
};

export class DQNAgent<TState extends tf.Tensor> implements RLAgent<TState, TAction>{
  params: TParams;
  model: tf.Sequential;
  memory: Memory<TMem<TState>>

  constructor(
    params: TParams
  ) {
    this.params = {
      name: 'GenericDQN',
      epsilon: 1,
      gamma: .95,
      memory_size: 50000,
      batch_size: 500,
      epsilon_min: .01,
      epsilon_decay: .995,
      learning_rate: 0.00025,
      layer_sizes: [128, 128, 128],
      ...params
    }
    this.memory = new Memory(this.params.memory_size);
    this.model = this.build_model();
  }

  act(state: TState): TAction {
    if (Math.random() <= this.params.epsilon) {
      return Math.floor(Math.random() * this.params.action_space);
    }
    // Need to tidy for garbage collection in tensorflowjs
    return tf.tidy(() => {
      let prediction = this.model.predict(state) as tf.Tensor<tf.Rank>;
      return tf.argMax(prediction, 1).dataSync()[0];
    });
  }

  remember(state: TState, action: TAction, reward: number, next_state: TState, done: boolean): void {
    this.memory.push(
      { state, action, reward, next_state, done }
    );
  }

  replay(): void {
    if (this.memory.length < this.params.batch_size) { return; }

    let minibatch = this.memory.sample(this.params.batch_size);
    let states = tf.tensor(minibatch.map((x: TMem<TState>) => x.state.dataSync()[0]));
    let actions = minibatch.map((x: TMem<TState>) => x.action);
    let rewards = minibatch.map((x: TMem<TState>) => x.reward);
    let next_states = tf.tensor(minibatch.map((x: TMem<TState>) => x.next_state.dataSync()[0]));
    let dones = minibatch.map((x: TMem<TState>) => x.done);

    let predictions = this.model.predictOnBatch(next_states);
    // TODO: clean up this monster formula
    let targets = rewards.map((reward: number, i: number) => reward + this.params.gamma + tf.argMax(predictions[i]).dataSync()[1] * (1 - (dones[i] ? 0 : 1)));
    let targets_full = this.model.predictOnBatch(states);

    let indices = tf.tensor([...Array(this.params.batch_size).keys()])

    // TODO: finish updating targets_full before passing it as labels to the
    // model

    this.model.fit(states, targets_full, { epochs: 1, verbose: 0 });
    if (this.params.epsilon > this.params.epsilon_min) {
      this.params.epsilon *= this.params.epsilon_decay;
    }
  }

  private build_model() {
    let model = tf.sequential();
    this.params.layer_sizes.forEach((size, i: number) =>
      model.add(tf.layers.dense({
        units: size,
        activation: 'relu',
        inputDim: i == 0 ? this.params.state_space : undefined,
      }))
    );
    model.add(tf.layers.dense({
      units: this.params.action_space,
      activation: 'softmax'
    }));

    model.compile({
      optimizer: tf.train.adam(this.params.learning_rate),
      loss: 'meanSquaredError'
    });

    return model;
  }
}
