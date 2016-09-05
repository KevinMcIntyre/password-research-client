import { Map } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const TOGGLE_LOADING_STATE = 'TOGGLE_LOADING_STATE';
const TOGGLE_TESTING = 'TOGGLE_TESTING';
// ------------------------------------
// Actions
// ------------------------------------
export const setLoadingState = (loading, text) => ({type: TOGGLE_LOADING_STATE, loading: loading, text: text});
export const setTestingStatus = (status) => ({type: TOGGLE_TESTING, status: status});
export const actions = {
  setLoadingState,
  setTestingStatus
};

// ------------------------------------
// State
// ------------------------------------
const appState = Map({
  loading: false,
  loadingText: 'Processing',
  isTesting: false
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer(state = appState, action = null) {
  switch (action.type) {
    case TOGGLE_TESTING: {
      return state.set('isTesting', action.status);
    }
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
