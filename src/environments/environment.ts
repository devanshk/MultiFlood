export interface Environment<TState, TAction> {
  action_space: () => number; // Number of possible actions
  state_space: () => number; // Number of fields in state

  reset: () => TState;
  step: (action: TAction) => { state: TState, reward: number, done: boolean };
}
