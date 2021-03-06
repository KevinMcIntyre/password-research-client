import Immutable from 'immutable';
import { setLoadingState } from './app.js';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { push } from 'react-router-redux';

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const SET_SUBJECT = 'SET_SUBJECT';
const SET_TEST = 'SET_TEST';
const INCREMENT_WIZARD = 'INCREMENT_SETUP_WIZARD';
const DECREMENT_WIZARD = 'DECREMENT_SETUP_WIZARD';
const RESET_TEST_SETUP = 'RESET_TEST_SETUP';
const SET_CONFIGS = 'SET_CONFIGS';
const SET_TEST_CONFIG = 'SET_TEST_CONFIG';
const SET_USER_IMAGE_SELECT = 'SET_USER_IMAGE_SELECT';
const SELECT_USER_IMAGE = 'SELECT_USER_IMAGE';
const START_TRIAL = 'START_TRIAL';
const SET_TRIALS = 'SET_TRIALS';
const ADD_TRIAL = 'ADD_TRIAL';
const POP_TRIAL = 'POP_TRIAL';
const SET_ALLOWED_ATTEMPTS = 'SET_ALLOWED_ATTEMPTS';
const SET_SUBJECT_ID = 'SET_SUBJECT_ID';

// ------------------------------------
// Wizard Stage Constants
// ------------------------------------
const SUBJECT_SELECT = 1;
const IMAGEPASS_SETUP = 2;
const PASSWORD_SETUP = 3;
const CONFIRMATION = 4;
export const wizardStages = {
  SUBJECT_SELECT,
  IMAGEPASS_SETUP,
  PASSWORD_SETUP,
  CONFIRMATION
};

// ------------------------------------
// Actions
// ------------------------------------
export const setSubjectId = (subjectId) => ({type: SET_SUBJECT_ID, subjectId: subjectId});
export const addTrial = (trial) => ({type: ADD_TRIAL, trial: trial});
export const setTrials = (trials) => ({type: SET_TRIALS, trials: trials ? trials : []});
export const getTrials = () => {
  return dispatch => {
    agent
    .get('http://localhost:7000/trial/list')
    .set({
    'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      dispatch(setTrials(JSON.parse(res.text)));
    }, function (err) {
      console.log(err);
    }).then(function() {
      dispatch(setLoadingState(false));
    });
  }
};
export const savePasswordTrial = (subjectId, trialType, allowedAttempts) => {
  return dispatch => {
    const request = {
      subjectId: parseInt(subjectId, 10),
      trialType: trialType,
      allowedAttempts: allowedAttempts
    };
    agent
    .post('http://localhost:7000/test/settings/password/submit')
    .send(JSON.stringify(request))
    .set({
    'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      dispatch(addTrial((JSON.parse(res.text))));
    }, function (err) {
      console.log(err);
    }).then(function() {
      dispatch(resetTestSetup());
    });
  }
}
export const saveImageTrial = (subjectId, configId, stages, userPassImages) => {
  return dispatch => {
    const request = {
      subjectId: parseInt(subjectId, 10),
      configId: parseInt(configId, 10),
      stages: parseInt(stages, 10),
      userPassImages: convertUserPassImages(userPassImages)
    };
    agent
    .post('http://localhost:7000/test/settings/image/submit')
    .send(JSON.stringify(request))
    .set({
    'Access-Control-Allow-Origin': 'localhost:7000'
    })
    .end()
    .then(function (res) {
      dispatch(addTrial((JSON.parse(res.text))));
    }, function (err) {
      console.log(err);
    }).then(function() {
      dispatch(resetTestSetup());
    });
  }
};
export const selectUserImage = (index, alias) => ({type: SELECT_USER_IMAGE, index: index, alias: alias});
export const setUserImageSelect = (userImageIndex) =>({type: SET_USER_IMAGE_SELECT, userImageIndex: userImageIndex});
export const setSubject = (subjectId, subjectData, subjectImages) => ({type: SET_SUBJECT, subjectId: subjectId, subjectData: subjectData, subjectImages: subjectImages});
export const setTest = (testType) => ({type: SET_TEST, testType: testType});
export const incrementWizard = () => ({type: INCREMENT_WIZARD});
export const decrementWizard = () => ({type: DECREMENT_WIZARD});
export const resetTestSetup = () => ({type: RESET_TEST_SETUP});
export const setConfigs = (configs) => ({type: SET_CONFIGS, configs: configs});
export const setConfig = (id, name, rows, columns, stages, imageMayNotBePresent, userImages) => ({
  type: SET_TEST_CONFIG,
  id: id,
  name: name,
  rows: rows,
  columns: columns,
  stages: stages,
  imageMayNotBePresent: imageMayNotBePresent,
  userImages: userImages
});
export const selectSubject = (subjectId, subjectData) => {
  return dispatch => {
    if (!subjectId) {
      dispatch(setSubject(undefined));
    } else {
      // Set the subject ID immediately so that the dropdown updates right away
      dispatch(setSubjectId(subjectId));
      let req = agent.get('http://localhost:7000/subject/images/' + subjectId);
      return req.set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      }).end()
        .then(function (res) {
          const subjectImages = JSON.parse(res.text);
          dispatch(setSubject(subjectId, subjectData, subjectImages));
        }, function (err) {
          console.log(err);
        });
    }
  }
};
export const loadConfigSettings = (configId) => {
  return dispatch => {
    if (configId === undefined) {
      dispatch(setConfig());
    } else {
      let req = agent.get('http://localhost:7000/config/' + configId);
      return req.set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      }).end()
        .then(function (res) {
          const json = JSON.parse(res.text);
          dispatch(
            setConfig(
              json.configId,
              json.name,
              json.rows,
              json.columns,
              json.stages,
              json.imageMaybeNotPresent,
              json.userImages
            )
          );
        }, function (err) {
          console.log(err);
        });
    }
  };
};
export const loadConfigs = () => {
  return dispatch => {
    return agent
      .get('http://localhost:7000/configs/list')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setConfigs(response));
          setTimeout(function() {
            dispatch(setLoadingState(false));
          }, 1000);
        }
      });
  };
};

export const popTrial = (trialId) => ({type: POP_TRIAL, trialId: trialId});

export const setAllowedAttemptsValue = (value) => ({type: SET_ALLOWED_ATTEMPTS, value: value});

export const actions = {
  setSubject,
  setTest,
  incrementWizard,
  decrementWizard,
  resetTestSetup,
  loadConfigs,
  loadConfigSettings,
  selectSubject,
  setUserImageSelect,
  selectUserImage,
  saveImageTrial,
  savePasswordTrial,
  getTrials,
  setAllowedAttemptsValue
};

// ------------------------------------
// State
// ------------------------------------
const testViewState = Immutable.Map({
  subjectId: undefined,
  subjectName: undefined,
  subjectHasPassword: undefined,
  subjectHasPin: undefined,
  subjectHasImages: undefined,
  subjectPassImages: [],
  subjectSelectError: false,
  wizardStage: SUBJECT_SELECT,
  testType: undefined,
  testTypeError: false,
  noConfigSelectedError: false,
  userPassImageError: false,
  imageTestOption: undefined,
  imageTestOptionList: [],
  selectingImageId: undefined,
  trials: [],
  config: Immutable.Map({
    name: undefined,
    rows: undefined,
    columns: undefined,
    stages: undefined,
    imageMayNotBePresent: undefined,
    userImages: []
  }),
  attemptsAllowed: '',
  attemptsNotSetError: false
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function testViewReducer(state = testViewState, action = null) {
  switch (action.type) {
    case SET_SUBJECT_ID: {
      return state
        .set('subjectId', action.subjectId)
        .set('subjectHasPassword', false)
        .set('subjectHasPin', false)
        .set('subjectHasImages', false);
    }
    case SET_ALLOWED_ATTEMPTS: {
      if (action.value === '') {
        return state.set('attemptsAllowed', '');
      }
      const previousValue = state.get('attemptsAllowed');
      const parsedValue = parseInt(action.value, 10);
      if (isNaN(parsedValue) || parsedValue > 100 || parsedValue <= 0) {
        return state.set('attemptsAllowed', previousValue);
      }
      return state.set('attemptsAllowed', parsedValue);
    }
    case POP_TRIAL: {
      let trials = state.get('trials').filter((trial) => {
        return trial.id != action.trialId
      });
      return state.set('trials', trials);
    }
    case ADD_TRIAL: {
      let trials = state.get('trials');
      trials.push(action.trial);
      return state.set('trials', trials);
    }
    case SET_TRIALS: {
      if (Array.isArray(action.trials)) {
              return state.set('trials', action.trials);
      }
      return state;
    }
    case SELECT_USER_IMAGE: {
      const config = state.get('config');
      let updatedImages =config.get('userImages').map(function(userImage){
        if (userImage.get('id') === action.index) {
          return userImage.set('image', action.alias)
        }
        return userImage;
      });

      if (state.get('userPassImageError')) {
        let allImagesSelected = true;
        for (let i =0; i < updatedImages.length; i++) {
          const userImage = updatedImages[i];
          if (!userImage.get('image')) {
            allImagesSelected = false;
            break;
          }
        }
        if (allImagesSelected) {
          state = state.set('userPassImageError', false);
        }
      }

      return state.set('config', config.set('userImages', updatedImages)).set('selectingImageId', undefined);
    }
    case SET_USER_IMAGE_SELECT: {
      return state.set('selectingImageId', action.userImageIndex);
    }
    case SET_TEST_CONFIG: {
      if (!action || !action.name) {
        state = state.set('imageTestOption', undefined).set('userPassImageError', false);
        return state.set('config', Immutable.Map({
          name: undefined,
          rows: undefined,
          columns: undefined,
          stages: undefined,
          imageMayNotBePresent: undefined,
          userImages: undefined
        }));
      }

      let config = state.get('config');
      config = config.set('name', action.name);
      config = config.set('rows', action.rows);
      config = config.set('columns', action.columns);
      config = config.set('stages', action.stages);
      config = config.set('imageMayNotBePresent', action.imageMayNotBePresent);

      let userImages = action.userImages;

      userImages.sort(function(a, b) {
        if (a.stage === b.stage) {
          if (a.row === b.row) {
            if (a.column < b.column) {
              return -1;
            } else {
              return 1;
            }
          } else {
            if (a.row < b.row) {
              return -1;
            } else {
              return 1;
            }
          }
        } else {
          if (a.stage < b.stage) {
            return -1;
          } else {
            return 1;
          }
        }
      });

      userImages = userImages.map(function(userImage, index) {
        return Immutable.fromJS(userImage).set('image', undefined).set('id', index);
      });

      config = config.set('userImages', userImages);
      state = state.set('imageTestOption', action.id);
      return state.set('config', config).set('noConfigSelectedError', false).set('userPassImageError', false);
    }
    case SET_CONFIGS: {
      let configList = [];
      if (action.configs) {
        action.configs.map((config) => {
          configList.push({value: config.Id, label: config.Label});
        });
      }
      return state.set('imageTestOptionList', configList);
    }
    case SET_SUBJECT: {
      if (state.get('subjectSelectError')) {
        state = state.set('subjectSelectError', false);
      }
      if (!action.subjectData) {
        state = state.set('subjectId', undefined)
          .set('subjectName', undefined)
          .set('subjectHasPassword', undefined)
          .set('subjectHasPin', undefined)
          .set('subjectHasImages', undefined)
          .set('subjectImages', undefined)
          .set('noConfigSelectedError', false).set('userPassImageError', false)
          .set('imageTestOption', undefined)
          .set('config', Immutable.Map({
            name: undefined,
            rows: undefined,
            columns: undefined,
            stages: undefined,
            imageMayNotBePresent: undefined,
            userImages: []
          }));
      } else {
        state = state.set('subjectId', action.subjectId)
          .set('subjectName', action.subjectData.get('name'))
          .set('subjectHasPassword', action.subjectData.get('hasPassword'))
          .set('subjectHasPin', action.subjectData.get('hasPin'))
          .set('subjectHasImages', action.subjectData.get('hasImages'))
          .set('subjectImages', action.subjectImages)
          .set('noConfigSelectedError', false).set('userPassImageError', false)
          .set('imageTestOption', undefined)
          .set('config', Immutable.Map({
            name: undefined,
            rows: undefined,
            columns: undefined,
            stages: undefined,
            imageMayNotBePresent: undefined,
            userImages: []
          }));

        switch (state.get('testType')) {
          case "image": {
            if (!state.get('subjectHasImages')) {
              state = state.set('testType', undefined);
            }
            break;
          }
          case "password": {
            if (!state.get('subjectHasPassword')) {
              state = state.set('testType', undefined);
            }
            break;
          }
          case "pin": {
            if (!state.get('subjectHasPin')) {
              state = state.set('testType', undefined);
            }
            break;
          }
          default: {
            break;
          }
        }
      }
      return state;
    }
    case SET_TEST: {
      if (state.get('testTypeError')) {
        state = state.set('testTypeError', false);
      }
      return state.set('testType', action.testType);
    }
    case INCREMENT_WIZARD: {
      let currentState = state.get('wizardStage');
      if (currentState === SUBJECT_SELECT) {
        if (state.get('subjectId') === undefined) {
          state = state.set('subjectSelectError', true);
        } else {
          state = state.set('subjectSelectError', false);
        }
        if (state.get('testType') === undefined) {
          state = state.set('testTypeError', true);
        } else {
          state = state.set('testTypeError', false);
        }
        if (state.get('subjectId') === undefined || state.get('testType') === undefined) {
          return state;
        }
        if (state.get('testType') === 'image') {
          return state.set('wizardStage', IMAGEPASS_SETUP).set('subjectSelectError', false);
        } else if (state.get('testType') === 'password' || state.get('testType') === 'pin') {
          return state.set('wizardStage', PASSWORD_SETUP).set('subjectSelectError', false);
        } else {
          return state.set('wizardStage', CONFIRMATION).set('subjectSelectError', false);
        }
      }
      if (currentState === IMAGEPASS_SETUP) {
        if (!state.get('imageTestOption')) {
          return state.set('noConfigSelectedError', true);
        } else {
          let userImages = state.get('config').get('userImages');
          let allImagesSelected = true;
          for (let i =0; i < userImages.length; i++) {
            const userImage = userImages[i];
            if (!userImage.get('image')) {
              allImagesSelected = false;
              break;
            }
          }
          if (allImagesSelected) {
           return state.set('userPassImageError', false).set('wizardStage', CONFIRMATION);
          } else {
            return state.set('userPassImageError', true);
          }
        }
      }
      if (currentState === PASSWORD_SETUP) {
        const allowedAttempts = state.get('attemptsAllowed');
        if (isNaN(allowedAttempts) || allowedAttempts > 100 || allowedAttempts <= 0) {
          return state.set('attemptsNotSetError', true)
        } else {
          return state.set('attemptsNotSetError', false).set('wizardStage', CONFIRMATION);
        }
      }
      if (currentState === CONFIRMATION) {
        return testViewState;
      } else {
        return state.set('wizardStage', (state.get('wizardStage') + 1)).set('subjectSelectError', false);
      }
    }
    case DECREMENT_WIZARD: {
      let currentState = state.get('wizardStage');
      if (currentState === PASSWORD_SETUP) {
        return state.set('wizardStage', SUBJECT_SELECT);
      }
      if (currentState === CONFIRMATION) {
        if (state.get('testType') === 'image') {
          return state.set('wizardStage', IMAGEPASS_SETUP);
        } else if (state.get('testType') === 'password' || state.get('testType') === 'pin') {
          return state.set('wizardStage', PASSWORD_SETUP);
        } else {
          return state.set('wizardStage', SUBJECT_SELECT);
        }
      }
      return state.set('wizardStage', (state.get('wizardStage') - 1));
    }
    case RESET_TEST_SETUP: {
      return testViewState.set('trials', state.get('trials')).set('imageTestOptionList', state.get('imageTestOptionList'));
    }
    default: {
      return state;
    }
  }
}

// ------------------------------------
// Utility Functions
// ------------------------------------
function convertUserPassImages(userPassImages) {
  return userPassImages.map((userPassImage) => {
    return {
      stage: userPassImage.get('stage'),
      row: userPassImage.get('row'),
      column: userPassImage.get('column'),
      alias: userPassImage.get('image')
    }
  })
}
