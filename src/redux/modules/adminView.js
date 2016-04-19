import { Map } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

export const actions = {};

// ------------------------------------
// State
// ------------------------------------
const adminViewState = Map({});
// ------------------------------------
// Reducer
// ------------------------------------
export default function adminViewReducer(state = adminViewState, action = null) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
