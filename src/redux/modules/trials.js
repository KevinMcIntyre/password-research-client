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
const BEGIN_TRIAL = 'BEGIN_TRIAL';

// ------------------------------------
// Actions
// ------------------------------------
export const beginTrial = () => ({type: BEGIN_TRIAL});
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
};
export const redirectToTestSetup = () => {
  return dispatch => {
    dispatch(push('/test'));
  }
};

export const actions = {
  beginTrial,
  endTrial,
  redirectToTestSetup
};


// ------------------------------------
// Wizard Stage Constants
// ------------------------------------
const INTRO = 1;
const AUTHENTICATION = 2;
const OUTRO = 3;

export const wizardStages = {
  INTRO,
  AUTHENTICATION,
  OUTRO
};

// ------------------------------------
// State
// ------------------------------------
const trialState = Immutable.Map({
  trialId: undefined,
  subjectName: undefined,
  stages: undefined,
  rows: undefined,
  columns: undefined,
  imageMayNotBePresent: undefined,
  matrix: undefined,
  authStage: 1,
  wizardStage: INTRO
});

// ------------------------------------
// Reducer
// ------------------------------------
export default function trialReducer(state = trialState, action = null) {
  switch (action.type) {
    case SET_TRIAL: {
      return state
        .set('trialId', action.trialData.id)
        .set('subjectName', action.trialData.subjectName)
        .set('stages', action.trialData.stages)
        .set('rows', action.trialData.rows)
        .set('columns', action.trialData.columns)
        .set('imageMayNotBePresent', action.trialData.imageMayNotBePresent)
        .set('matrix', Immutable.fromJS(action.trialData.matrix));
    }
    case BEGIN_TRIAL: {
      return state.set('wizardStage', AUTHENTICATION);
    }
    case RESET_TRIAL: {
      return trialState;
    }
    default: {
      return state;
    }
  }
}
