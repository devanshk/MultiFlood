import { DQNAgent } from './agents/dqn_agent';
import { SoloFlood, TState, TAction } from './environments/solo_flood';
import { RlTrainer } from './trainers/rl_trainer';

let env = new SoloFlood(10, 4);
let agent = new DQNAgent<TState, TAction>({
  state_space: env.state_space(),
  action_space: env.action_space()
});
let { performance } = new RlTrainer({ episodes: 50 }).train(agent, env);

console.log(performance);
