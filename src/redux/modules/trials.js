import Immutable from 'immutable';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { push } from 'react-router-redux';
import { setLoadingState, setTestingStatus } from './app';

const agent = _agent_promise(_agent, _promise);
// ------------------------------------
// Constants
// ------------------------------------
const SET_TRIAL = 'SET_TRIAL';
const RESET_TRIAL = 'RESET_TRIAL';

// ------------------------------------
// Actions
// ------------------------------------
export const setTrial = (trialData) => ({type: SET_TRIAL, trialData: trialData});
export const startTrial = (trialId) => {
  return dispatch => {
    dispatch(setTestingStatus(true));
    dispatch(push('/testing'));
    dispatch(setLoadingState(true, 'Prepping Trial...'));
    return agent
    .post('http://localhost:7000/trial/start')
    .send(JSON.stringify({
        trialId: trialId
      }))
    .set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      console.log(res);
      dispatch(setTrial((JSON.parse(res.text))));
    }, function (err) {
      console.log(err);
    })
    .then(function() {
        dispatch(setLoadingState(false));
    })
  }
};
export const resetTrial = () => ({type: RESET_TRIAL});
export const endTrial = () => {
  return dispatch => {
    dispatch(resetTrial());
    dispatch(setTestingStatus(false))
  }
}

export const actions = {
  endTrial
};

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
    case RESET_TRIAL: {
      return trialState;
    }
    default: {
      return state;
    }
  }
}
