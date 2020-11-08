import { RLAgent } from '../agents/rl_agent';
import { Environment } from '../environments/environment';

type TParams = {
  episodes?: number,
  max_steps?: number,
}

type TMetrics = {
  episode_rewards: Array<number>
}

export class RlTrainer<TState, TAction> {
  params: TParams;

  constructor(
    params: TParams
  ) {
    this.params = {
      episodes: 1,
      max_steps: 10000,
      ...params
    };
  }

  train(
    agent: RLAgent<TState, TAction>,
    env: Environment<TState, TAction>): {
      agent: RLAgent<TState, TAction>,
      performance: TMetrics
    } {
    let episode_rewards = []
    for (let e = 0; e < this.params.episodes; e++) {
      let state = env.reset()
      let score = 0
      for (let i = 0; i < this.params.max_steps; i++) {
        let action = agent.act(state);
        let { state: next_state, reward, done } = env.step(action);
        score += reward;
        agent.remember(state, action, reward, next_state, done);
        state = next_state
        agent.replay();
        if (done) {
          console.log('episode: ' + (e + 1) + '/' + this.params.episodes + ', score: ' + score)
        }
      }
      episode_rewards.push(score)
    }
    return {
      agent: agent,
      performance: {
        episode_rewards: episode_rewards
      }
    }
  }
}
