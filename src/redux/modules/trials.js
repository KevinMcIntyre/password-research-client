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
const SET_DISPLAY_INCORRECT_PASSWORD_MSG = 'SET_DISPLAY_INCORRECT_PASSWORD_MSG';
const SET_BLANK_PASSWORD_MSG = 'SET_BLANK_PASSWORD_MSG';

// ------------------------------------
// Actions
// ------------------------------------
export const setShowIncorrectPasswordMessage = (show) => ({type: SET_DISPLAY_INCORRECT_PASSWORD_MSG, show: show})
export const setBlankPasswordMessage = (show) => ({type: SET_BLANK_PASSWORD_MSG, show: show})
export const submitPassword = (trialId, password) => {
  return dispatch => {
    if (!password || password.length < 1) {
      dispatch(setBlankPasswordMessage(true));
    } else {
      return agent
        .post('http://localhost:7000/trial/submit-password')
        .send(JSON.stringify({
          trialId: trialId,
          password: password,
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
          } else {
            dispatch(setShowIncorrectPasswordMessage(true));
          }
        }, function (err) {
          console.log(err);
        });
    }
  }
};
export const setStartTimeAndBegin = (trialId, trialType) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/trial/set-start-time')
      .send(JSON.stringify({
        trialId: trialId,
        isImageTrial: (trialType === 'Pass-Image'),
        unixTimestamp: new Date().getTime().toString()
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function (res) {
        res = JSON.parse(res.text);
        if(res.success) {
          dispatch(setWizardStage(wizardStages.AUTHENTICATION));
        }
      }, function (err) {
        console.log(err);
      })
  }
};
export const setAuthStatus = (success) => ({type: SET_AUTH_STATUS, success: success});
export const incrementAuth = () => ({type: INCREMENT_AUTH});
export const selectPassImage = (trialId, stage, imageId) => {
  return dispatch => {
    dispatch(incrementAuth());
    return agent
    .post('http://localhost:7000/trial/submit-image')
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
          dispatch(endTrial(resJson.successfulAuth));
        }
    }, function (err) {
      console.log(err);
    })
  }
};
export const setWizardStage = (stage) => ({type: SET_WIZARD_STAGE, stage: stage});
export const setTrial = (trialData) => ({type: SET_TRIAL, trialData: trialData});
export const startTrial = (trialId, trialType) => {
  return dispatch => {
    dispatch(setTestingStatus(true));
    dispatch(push('/testing'));
    dispatch(setLoadingState(true, 'Prepping Trial...'));
    return agent
    .post('http://localhost:7000/trial/start')
    .send(JSON.stringify({
        trialId: trialId,
        isImageTrial: (trialType === 'Pass-Image')
      }))
    .set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      dispatch(
        setTrial({
              ...JSON.parse(res.text),
              ...{trialType: trialType}
      }));
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
  submitPassword,
  setWizardStage,
  endTrial,
  stopTrial,
  redirectToTestSetup,
  setStartTimeAndBegin
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
  trialType: undefined,
  subjectName: undefined,
  attemptsAllowed: undefined,
  attemptsTaken: 0,
  stages: undefined,
  rows: undefined,
  columns: undefined,
  imageMayNotBePresent: undefined,
  matrix: undefined,
  authStage: 1,
  wizardStage: INTRO,
  successfulAuth: undefined,
  showIncorrectPasswordMessage: false,
  showBlankPasswordMessage: false
});

// ------------------------------------
// Reducer
// ------------------------------------
export default function trialReducer(state = trialState, action = null) {
  switch (action.type) {
    case SET_BLANK_PASSWORD_MSG: {
      return state.set('showBlankPasswordMessage', action.show);
    }
    case SET_DISPLAY_INCORRECT_PASSWORD_MSG: {
      return state.set('showIncorrectPasswordMessage', action.show)
        .set('showBlankPasswordMessage', false)
        .set('attemptsTaken', state.get('attemptsTaken') + 1);
    }
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
      if (action.trialData.trialType === "Pass-Image") {
        return state
          .set('trialId', action.trialData.id)
          .set('trialType', action.trialData.trialType)
          .set('subjectName', action.trialData.subjectName)
          .set('stages', action.trialData.stages)
          .set('rows', action.trialData.rows)
          .set('columns', action.trialData.columns)
          .set('imageMayNotBePresent', action.trialData.imageMayNotBePresent)
          .set('matrix', Immutable.fromJS(action.trialData.matrix));
      } else {
        return state
          .set('trialId', action.trialData.id)
          .set('trialType', action.trialData.trialType)
          .set('attemptsAllowed', action.trialData.attemptsAllowed)
          .set('subjectName', action.trialData.subjectName)
      }
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
