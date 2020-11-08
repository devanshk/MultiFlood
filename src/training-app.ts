import { DQNAgent } from './agents/dqn_agent';
import { SoloFlood, TTFState, TAction } from './environments/solo_flood';
import { RlTrainer } from './trainers/rl_trainer';
import { Tensor1D } from '@tensorflow/tfjs';

let env = new SoloFlood(10, 4);
let agent = new DQNAgent<TTFState>({
  state_space: env.state_space(),
  action_space: env.action_space()
});
let { performance } = new RlTrainer({ episodes: 50 }).train(agent, env);

console.log(performance);
