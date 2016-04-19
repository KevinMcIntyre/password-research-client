import { Map } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const TOGGLE_LOADING_STATE = 'TOGGLE_LOADING_STATE';
// ------------------------------------
// Actions
// ------------------------------------
export const setLoadingState = (loading, text) => ({type: TOGGLE_LOADING_STATE, loading: loading, text: text});

export const actions = {
  setLoadingState
};

// ------------------------------------
// State
// ------------------------------------
const appState = Map({
  loading: false,
  loadingText: 'Processing'
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer(state = appState, action = null) {
  switch (action.type) {
    case TOGGLE_LOADING_STATE: {
      if (action.text !== undefined) {
        state = state.set('loadingText', action.text);
      }
      return state.set('loading', action.loading);
    }
    default: {
      return state;
    }
  }
}
