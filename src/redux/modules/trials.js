import Immutable from 'immutable';
import { setLoadingState } from './app.js';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';

// ------------------------------------
// Constants
// ------------------------------------
const SET_TRIAL = 'SET_TRIAL';

// ------------------------------------
// Actions
// ------------------------------------
export const setTrial = (trialData) => ({type: SET_TRIAL, trialData: trialData});
export const startTrial = (trialId) => {
  return dispatch => {
    agent
    .post('http://localhost:7000/trial/start')
    .send(JSON.stringify({
        trialId: trialId
      }))
    .set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      dispatch(setTrial((JSON.parse(res.text))));
    }, function (err) {
      console.log(err);
    })
    .then(function() {
        dispatch(push('/trial/' + trialId));
    })
  }
};

export const actions = {};

// ------------------------------------
// State
// ------------------------------------
const trialState = Immutable.Map({});

// ------------------------------------
// Reducer
// ------------------------------------
export default function trialReducer(state = trialState, action = null) {
  switch (action.type) {
    case SET_TRIAL: {
      return state;
    }
    default: {
      return state;
    }
  }
}
