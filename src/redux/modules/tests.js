import Immutable from 'immutable';
import { setLoadingState } from './app.js';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { trimMatrix } from './config'

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

// ------------------------------------
// Wizard Stage Constants
// ------------------------------------
const SUBJECT_SELECT = 1;
const IMAGEPASS_SETUP = 2;
const CONFIRMATION = 3;

export const wizardStages = {
  SUBJECT_SELECT,
  IMAGEPASS_SETUP,
  CONFIRMATION
};

// ------------------------------------
// Actions
// ------------------------------------
export const startTrial = (subjectId, configId, stages, rows, columns, imageMaybeNotPresent, matrix, userPassImages) => {
  return dispatch => {
    const request = {
      subjectId: parseInt(subjectId, 10),
      configId: parseInt(configId, 10),
      stages: parseInt(stages, 10),
      rows: parseInt(rows, 10),
      columns: parseInt(columns, 10),
      imageMaybeNotPresent: imageMaybeNotPresent,
      matrix: trimMatrix(stages, rows, columns, matrix)
    };
    agent
      .post('http://localhost:7000/test/settings/submit')
      .send(JSON.stringify(request))
      .set({
      'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function (res) {
        console.log(res);
        dispatch(resetTestSetup());
      }, function (err) {
        console.log(err);
      });
  }
};

export const selectUserImage = (index, alias) => ({type: SELECT_USER_IMAGE, index: index, alias: alias});
export const setUserImageSelect = (userImageIndex) =>({type: SET_USER_IMAGE_SELECT, userImageIndex: userImageIndex});
export const setSubject = (subjectId, subjectName, subjectImages) => ({type: SET_SUBJECT, subjectId: subjectId, subjectName: subjectName, subjectImages: subjectImages});
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

export const selectSubject = (subjectId, subjectName) => {
  return dispatch => {
    if (!subjectId) {
      dispatch(setSubject(undefined));
    } else {
      let req = agent.get('http://localhost:7000/subject/images/' + subjectId);
      return req.set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      }).end()
        .then(function (res) {
          const subjectImages = JSON.parse(res.text);
          dispatch(setSubject(subjectId, subjectName, subjectImages));
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
  startTrial
};

// ------------------------------------
// State
// ------------------------------------
const testViewState = Immutable.Map({
  subjectId: undefined,
  subjectName: undefined,
  subjectPassImages: [],
  wizardStage: SUBJECT_SELECT,
  testType: undefined,
  subjectSelectError: false,
  testTypeError: false,
  noConfigSelectedError: false,
  userPassImageError: false,
  imageTestOption: undefined,
  imageTestOptionList: [],
  selectingImageId: undefined,
  config: Immutable.Map({
    name: undefined,
    rows: undefined,
    columns: undefined,
    stages: undefined,
    imageMayNotBePresent: undefined,
    userImages: []
  })
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function testViewReducer(state = testViewState, action = null) {
  switch (action.type) {
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
      return state.set('subjectId', action.subjectId)
        .set('subjectName', action.subjectName)
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
      if (currentState === CONFIRMATION) {
        return testViewState;
      } else {
        return state.set('wizardStage', (state.get('wizardStage') + 1)).set('subjectSelectError', false);
      }
    }
    case DECREMENT_WIZARD: {
      let currentState = state.get('wizardStage');
      if (currentState === CONFIRMATION) {
        if (state.get('testType') === 'image') {
          return state.set('wizardStage', IMAGEPASS_SETUP);
        } else {
          return state.set('wizardStage', SUBJECT_SELECT);
        }
      }
      return state.set('wizardStage', (state.get('wizardStage') - 1));
    }
    case RESET_TEST_SETUP: {
      return testViewState;
    }
    default: {
      return state;
    }
  }
}
