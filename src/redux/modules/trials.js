import Immutable from 'immutable';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { push } from 'react-router-redux';
import { setLoadingState, setTestingStatus } from './app';
import { popTrial } from './tests';

const agent = _agent_promise(_agent, _promise);
// ------------------------------------
// Constants
// ------------------------------------
const SET_TRIAL = 'SET_TRIAL';
const RESET_TRIAL = 'RESET_TRIAL';
const SET_WIZARD_STAGE = 'SET_WIZARD_STAGE';
const INCREMENT_AUTH = 'INCREMENT_AUTH';
const SET_AUTH_STATUS = 'SET_AUTH_STATUS';

// ------------------------------------
// Actions
// ------------------------------------
export const setAuthStatus = (success) => ({type: SET_AUTH_STATUS, success: success});
export const incrementAuth = () => ({type: INCREMENT_AUTH});
export const selectPassImage = (trialId, stage, imageId) => {
  return dispatch => {
    dispatch(incrementAuth());
    return agent
    .post('http://localhost:7000/trial/submit')
    .send(JSON.stringify({
      trialId: trialId,
      stage: stage,
      imageAlias: imageId,
      unixTimestamp: new Date().getTime().toString()
    }))
    .set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
        const resJson = JSON.parse(res.text);
        if (resJson.trialComplete) {
          dispatch(endTrial(resJson.successfulAuth))
        }
    }, function (err) {
      console.log(err);
    })
  }
};
export const setWizardStage = (stage) => ({type: SET_WIZARD_STAGE, stage: stage});
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
export const endTrial = (successfulAuth) => {
  return dispatch => {
    dispatch(setAuthStatus(successfulAuth));
    dispatch(setWizardStage(wizardStages.OUTRO));
  }
};
export const resetTrial = () => ({type: RESET_TRIAL});
export const stopTrial = (trialId) => {
  return dispatch => {
    dispatch(popTrial(trialId));
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
  selectPassImage,
  setWizardStage,
  endTrial,
  stopTrial,
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
  wizardStage: INTRO,
  successfulAuth: undefined
});

// ------------------------------------
// Reducer
// ------------------------------------
export default function trialReducer(state = trialState, action = null) {
  switch (action.type) {
    case SET_AUTH_STATUS: {
      return state.set('successfulAuth', action.success);
    }
    case INCREMENT_AUTH: {
      const currentStage = state.get('authStage');

      if (currentStage === state.get('stages')) {
        return state;
      }

      return state.set('authStage', currentStage + 1);
    }
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
    case SET_WIZARD_STAGE: {
      return state.set('wizardStage', action.stage);
    }
    case RESET_TRIAL: {
      return trialState;
    }
    default: {
      return state;
    }
  }
}
