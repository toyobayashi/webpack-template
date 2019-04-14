import { createStore, Action } from 'redux'

export interface AppState {
  count: number
}

export enum ActionType {
  COUNT
}

export interface AppAction<T = any> extends Action<ActionType> {
  value?: T
}

const data: AppState = {
  count: 0
}

export function commitCount (value: number): AppAction<number> {
  return {
    type: ActionType.COUNT,
    value
  }
}

function reducer (state: AppState = data, action: AppAction): AppState {
  switch (action.type) {
    case ActionType.COUNT:
      return {
        ...state,
        count: state.count + action.value
      }
    default:
      return state
  }
}

const store = createStore(reducer)

export default store
