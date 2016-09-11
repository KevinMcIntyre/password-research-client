import Immutable from 'immutable';
import { setLoadingState } from './app';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';
import { push } from 'react-router-redux';

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const INCREMENT_WIZARD = 'INCREMENT_WIZARD';
const DECREMENT_WIZARD = 'DECREMENT_WIZARD';
const TOGGLE_MAY_NOT_HAVE_IMAGE = 'TOGGLE_MAY_NOT_HAVE_IMAGE';
const SET_CONFIG = 'SET_CONFIG';
const CLEAR_FORM = 'CLEAR_FORM';
const UPDATE_TEST_NAME = 'UPDATE_TEST_NAME';
const SET_CONFIG_STAGES = 'SET_CONFIG_STAGES';
const TOGGLE_CHANGE_IMAGE_MODAL = 'TOGGLE_CHANGE_IMAGE_MODAL';
const SET_REPLACEMENT_TYPE = 'SET_REPLACEMENT_TYPE';
const SET_RANDOM_IMAGE = 'SET_RANDOM IMAGE';
const SET_REPLACEMENT_IMAGE = 'SET_REPLACEMENT_IMAGE';
const UPDATE_IMAGE_MATRIX = 'UPDATE_IMAGE_MATRIX';
const GET_CONFIG_ID = 'GET_CONFIG_ID';
const SET_CONFIG_ID = 'SET_CONFIG_ID';
const SAVE_CONFIG = 'SAVE_CONFIG';
const SET_CONFIGS = 'SET_CONFIGS';
const SELECT_CONFIG = 'SELECT_CONFIG';
const SET_SPECIFIC_MATRIX_IMAGE = 'SET_SPECIFIC_MATRIX_IMAGE';
const INCREMENT_STAGE = 'INCREMENT_STAGE';
const DECREMENT_STAGE = 'DECREMENT_STAGE';

// ------------------------------------
// Wizard Stage Constants
// ------------------------------------
const CONFIG_INIT = 1;
const STAGE_SETUP = 2;
const CONFIRMATION = 3;

export const wizardStages = {
  CONFIG_INIT,
  STAGE_SETUP,
  CONFIRMATION
};

// ------------------------------------
// Actions
// ------------------------------------
export const setSpecificImageInMatrix = (stage, row, column, alias) => ({
  type: SET_SPECIFIC_MATRIX_IMAGE,
  stage: stage,
  row: row,
  column: column,
  alias: alias
});
const incrementStage = () => ({type: INCREMENT_STAGE});
const decrementStage = () => ({type: DECREMENT_STAGE});
export const loadConfigImages = (configId) => {
  return dispatch => {
    let req = agent.post('http://localhost:7000/config')
      .field('configId', configId);
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    }).end()
      .then(function (res) {
        const json = JSON.parse(res.text);
        dispatch(setConfigId(configId));
        dispatch(setConfig(json.name, json.rows, json.columns, json.stages));
        dispatch(toggleMayNotHaveImage(json.imageMaybeNotPresent));
        dispatch(setConfigStages(Immutable.fromJS(json.matrix)));
        setTimeout(function() {
          dispatch(setLoadingState(false));
        }, 1000);
      }, function (err) {
        console.log(err);
      });
  };
};
export const selectConfig = (config) => ({type: SELECT_CONFIG, config: config});
export const setConfigs = (configs) => ({type: SET_CONFIGS, configs: configs});
export const loadConfigs = (configId, imageMaybeNotPresent) => {
  return dispatch => {
    return agent
      .get('http://localhost:7000/configs/list')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setConfigs(response));
          if (configId) {
            response.map(config => {
              if (config.Id === parseInt(configId, 10)) {
                dispatch(selectConfig({
                  id: config.Id,
                  label: config.Label
                }));
                dispatch(loadConfigImages(config.Id, imageMaybeNotPresent));
              }
            });
          } else {
            setTimeout(function() {
              dispatch(setLoadingState(false));
            }, 1000);
          }
        }
      });
  };
};
export const saveConfig = (configId, name, stages, rows, columns, imageMaybeNotPresent, matrix) => {
  return dispatch => {
    const request = {
      configId: parseInt(configId),
      name: name,
      stages: parseInt(stages),
      rows: parseInt(rows),
      columns: parseInt(columns),
      imageMaybeNotPresent: imageMaybeNotPresent,
      matrix: trimMatrix(stages, rows, columns, matrix)
    };
    return agent
      .post('http://localhost:7000/config/save')
      .send(JSON.stringify(request))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          dispatch(push('/configurations/' + configId));
        }
      });
  }
};

export const trimMatrix = (stages, rows, columns, matrix) => {
  let matrixObj = {};
  for (let i = 1; i <= parseInt(stages); i++) {
    let stageObj = {};
    for (let j = 1; j <= parseInt(rows); j++) {
      let rowObj = {};
      for (let k = 1; k <= parseInt(columns); k++) {
        rowObj[k.toString()] = matrix.get(i.toString()).get(j.toString()).get(k.toString());
      }
      stageObj[j.toString()] = rowObj;
    }
    matrixObj[i.toString()] = stageObj;
  }
  return matrixObj;
};

const setConfigId = (configId) => ({type: SET_CONFIG_ID, configId: configId});
const updateImageMatrix = (stage, row, column, alias) => ({
  type: UPDATE_IMAGE_MATRIX,
  stage: stage.toString(),
  row: row.toString(),
  column: column.toString(),
  alias: alias
});
export const confirmImageReplacement = (configId, selectedAlias, selectedStage, selectedRow, selectedColumn, replacementAlias, replacementType, collectionId) => {
  if (selectedAlias === 'user-img' && replacementAlias === 'user-img') {
    return dispatch => {
      dispatch(toggleChangeImageModal(undefined));
    };
  }
  return dispatch => {
    let req = agent.post('http://localhost:7000/image/replace')
      .field('configId', configId)
      .field('selectedAlias', selectedAlias)
      .field('selectedStage', selectedStage)
      .field('selectedRow', selectedRow)
      .field('selectedColumn', selectedColumn)
      .field('replacementAlias', replacementAlias)
      .field('replacementType', replacementType)
      .field('collectionId', collectionId);
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    }).end()
      .then(function (res) {
        let json = JSON.parse(res.text);
        dispatch(updateImageMatrix(json.Stage, json.Row, json.Column, json.Alias));
        dispatch(toggleChangeImageModal(undefined));
      }, function (err) {
        console.log(err);
      });
  }
};
export const setReplacementAlias = (replacementAlias) => ({type: SET_REPLACEMENT_IMAGE, alias: replacementAlias});
export const setRandomImageAlias = (randomAlias) => ({type: SET_RANDOM_IMAGE, alias: randomAlias});
export const getRandomImage = (configId, replacingAlias) => {
  return dispatch => {
    dispatch(setRandomImageAlias(undefined));
    let req = agent.post('http://localhost:7000/random/image')
      .field('configId', configId)
      .field('alias', replacingAlias);
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    }).end()
      .then(function (res) {
        dispatch(setRandomImageAlias(res.text.substring(1, (res.text.length - 1))));
      }, function (err) {
        console.log(err);
      });
  };
};
export const setReplacementType = (replacementType) => ({type: SET_REPLACEMENT_TYPE, replacementType: replacementType});
export const changeReplacementType = (replacementType, configId, replacingAlias) => {
  return dispatch => {
    if (replacementType === 'random-img') {
      dispatch(getRandomImage(configId, replacingAlias))
    }
    dispatch(setReplacementType(replacementType));
  }
};
export const toggleChangeImageModal = (stage, row, column, imageAlias) => ({type: TOGGLE_CHANGE_IMAGE_MODAL, imageAlias: imageAlias, stage: stage, row: row, column: column});
export const incrementWizard = () => ({type: INCREMENT_WIZARD});
export const decrementWizard = () => ({type: DECREMENT_WIZARD});
export const toggleMayNotHaveImage = (mayNotHaveImage) => ({type: TOGGLE_MAY_NOT_HAVE_IMAGE, mayNotHaveImage: mayNotHaveImage});
export const clearForm = () => ({type: CLEAR_FORM});
export const setConfig = (name, rows, columns, stages) => ({
  type: SET_CONFIG,
  name: name,
  rows: rows,
  columns: columns,
  stages: stages
});
export const updateTestName = (name) => ({type: UPDATE_TEST_NAME, name: name});
export const setConfigStages = (stageMap) => ({type: SET_CONFIG_STAGES, stages: stageMap});
export const generateConfigStages = (stages, rows, columns) => {
  return dispatch => {
    let req = agent.post('http://localhost:7000/random/stages')
      .field('stages', stages)
      .field('rows', rows)
      .field('columns', columns);
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    }).end()
      .then(function (res) {
        const json = JSON.parse(res.text);
        dispatch(setConfigStages(Immutable.fromJS(json.Matrix)));
        dispatch(setConfigId(json.Id));
        dispatch(setLoadingState(false));
      }, function (err) {
        console.log(err);
      });
  };
};
export const actions = {
  incrementWizard,
  decrementWizard,
  toggleMayNotHaveImage,
  setConfig,
  setConfigStages,
  generateConfigStages,
  clearForm,
  updateTestName,
  toggleChangeImageModal,
  changeReplacementType,
  getRandomImage,
  setReplacementAlias,
  confirmImageReplacement,
  saveConfig,
  loadConfigs,
  selectConfig,
  loadConfigImages,
  incrementStage,
  decrementStage,
  setSpecificImageInMatrix
};

// ------------------------------------
// State
// ------------------------------------
const configViewState = Immutable.Map({
  configs: [],
  wizardStage: CONFIG_INIT,
  configId: undefined,
  name: undefined,
  rows: '4',
  columns: '4',
  stages: '6',
  currentStageBeingSet: 1,
  createdStages: undefined,
  mayNotHaveSubjectImage: true,
  configErrors: [],
  showChangeImageModal: false,
  selectedAlias: undefined,
  selectedStage: undefined,
  selectedRow: undefined,
  selectedColumn: undefined,
  replacementType: undefined,
  replacementAlias: undefined,
  randomAlias: undefined,
  assignUserImgError: false
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function configViewReducer(state = configViewState, action = null) {
  switch (action.type) {
    case SET_SPECIFIC_MATRIX_IMAGE: {
      const matrix = state.get('createdStages');
      let stage = matrix.get(action.stage.toString());
      let row = stage.get(action.row.toString());
      row = row.set(action.column.toString(), action.alias);
      stage = stage.set(action.row.toString(), row);
      return state.set('createdStages', matrix.set(action.stage.toString(), stage));
    }
    case INCREMENT_STAGE: {
      const currentStage = state.get('currentStageBeingSet');
      const numberOfStages = state.get('stages');
      if (currentStage < numberOfStages) {
        return state.set('currentStageBeingSet', currentStage + 1);
      }
      return
    }
    case DECREMENT_STAGE: {
      const currentStage = state.get('currentStageBeingSet');
      if (currentStage > 1) {
        return state.set('currentStageBeingSet', currentStage - 1);
      }
      return
    }
    case SET_CONFIGS: {
      let configList = [];
      if (action.configs) {
        action.configs.map((config) => {
          configList.push({value: config.Id, label: config.Label});
        });
      }
      return state.set('configs', configList)
    }
    case SET_CONFIG_ID:
    {
      return state.set('configId', action.configId);
    }
    case UPDATE_IMAGE_MATRIX:
    {
      const matrix = state.get('createdStages');;
      const stage = matrix.get(action.stage);
      const row = stage.get(action.row);
      if (action.alias === 'user-img') {
        state = state.set('assignUserImgError', false)
      }
      return state.set('createdStages', matrix.set(action.stage, stage.set(action.row, row.set(action.column, action.alias))));
    }
    case SET_RANDOM_IMAGE:
    {
      return state.set('randomAlias', action.alias);
    }
    case SET_REPLACEMENT_IMAGE:
    {
      return state.set('replacementAlias', action.alias);
    }
    case SET_REPLACEMENT_TYPE:
    {
      if (action.replacementType === 'user-img') {
        state = state.set('replacementAlias', 'user-img');
      }
      return state.set('replacementType', action.replacementType);
    }
    case TOGGLE_CHANGE_IMAGE_MODAL:
    {
      if (typeof(action.imageAlias) === 'string' && typeof(action.stage) === 'number' && typeof(action.row) === 'number' && typeof(action.row) === 'number') {
        state = state.set('selectedAlias', action.imageAlias).set('selectedStage', action.stage).set("selectedRow", action.row).set("selectedColumn", action.column);
      }
      if (state.get('showChangeImageModal')) {
        state = state.set('replacementType', undefined).set('replacementAlias', undefined);
      }
      return state.set('showChangeImageModal', !state.get('showChangeImageModal'));
    }
    case TOGGLE_MAY_NOT_HAVE_IMAGE:
    {
        if (action.mayNotHaveImage) {
          state = state.set('assignUserImgError', false)
        }
        return state.set('mayNotHaveSubjectImage', action.mayNotHaveImage);
    }
    case SET_CONFIG:
    {
      let stageMap = Immutable.Map({});
      for (let i = 1; i <= parseInt(action.stages, 10); i++) {
        for (let j = 1; j <= parseInt(action.rows, 10); j++) {
          let row = stageMap.get(i);
          if (!row) {
            row = Immutable.Map({});
          }
          let images = Immutable.Map({});
          for (let k = 1; k <= parseInt(action.columns, 10); k++) {
            images = images.set(k, 7);
          }
          row = row.set(j, images);
          stageMap = stageMap.set(i, row);
        }
      }
      return state
        .set('name', action.name)
        .set('rows', action.rows)
        .set('columns', action.columns)
        .set('stages', action.stages);
    }
    case SET_CONFIG_STAGES:
    {
      return state.set('createdStages', action.stages);
    }
    case INCREMENT_WIZARD:
    {
      let currentState = state.get('wizardStage');
      if (currentState === STAGE_SETUP) {
        if (state.get('currentStageBeingSet') === parseInt(state.get('stages'), 10)) {
          if (matrixIsValid(state)) {
            return state.set('wizardStage', (state.get('wizardStage') + 1)).set('assignUserImgError', false);
          }
          return state.set('assignUserImgError', true);
        } else {
          if (matrixIsValid(state)) {
            return state.set('currentStageBeingSet', (state.get('currentStageBeingSet') + 1)).set('assignUserImgError', false);
          }
          return state.set('assignUserImgError', true);
        }
      }
      if (currentState === CONFIRMATION) {
        return configViewState;
      } else {
        return state.set('wizardStage', (state.get('wizardStage') + 1));
      }
    }
    case DECREMENT_WIZARD:
    {
      let currentState = state.get('wizardStage');
      if (currentState === STAGE_SETUP) {
        if (state.get('currentStageBeingSet') === 1) {
          return state.set('wizardStage', (state.get('wizardStage') - 1));
        } else {
          return state.set('currentStageBeingSet', (state.get('currentStageBeingSet') - 1));
        }
      }
      return state.set('wizardStage', (state.get('wizardStage') - 1));
    }
    case CLEAR_FORM:
    {
      return configViewState;
    }
    case UPDATE_TEST_NAME:
    {
      return state.set('name', action.name);
    }
    default:
    {
      return state;
    }
  }
}

function matrixIsValid(state) {
  if (!state.get('mayNotHaveSubjectImage')) {
    const currentStageMatrix = state.get('createdStages').get(state.get('currentStageBeingSet').toString());
    const rows = parseInt(state.get('rows'), 10);
    const columns = parseInt(state.get('columns'), 10);
    let userPassImageFound = false;
    for (let i = 1; i <= rows; i++) {
      let row = currentStageMatrix.get(i.toString());
      for (let j = 1; j <= columns; j++) {
        let columnValue = row.get(j.toString());
        if (columnValue === 'user-img') {
          userPassImageFound = true;
        }
      }
    }
    return userPassImageFound;
  }
  return true;
}
