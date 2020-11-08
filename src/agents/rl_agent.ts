export interface RLAgent<TState, TAction> {
  act: (state: TState) => TAction;
  remember: (state: TState, action: TAction, reward: number, next_state: TState, done: boolean) => void;
  replay: () => void;
}
