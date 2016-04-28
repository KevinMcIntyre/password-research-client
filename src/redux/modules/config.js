import Immutable from 'immutable'
import { setLoadingState } from './app';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';

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
export const incrementWizard = () => ({type: INCREMENT_WIZARD});
export const decrementWizard = () => ({type: DECREMENT_WIZARD});
export const toggleMayNotHaveImage = () => ({type: TOGGLE_MAY_NOT_HAVE_IMAGE});
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
export const generateConfigStages = (configId, stages, rows, columns) => {
  return dispatch => {
    let req = agent.post('http://localhost:7000/random/stages')
      .field('configId', configId)
      .field('stages', stages)
      .field('rows', rows)
      .field('columns', columns);
    return req.set({
      'Access-Control-Allow-Origin': 'localhost:7000'
    }).end()
      .then(function (res) {
        const json = JSON.parse(res.text);
        dispatch(setConfigStages(Immutable.fromJS(json)));
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
  updateTestName
};

// ------------------------------------
// State
// ------------------------------------
const configViewState = Immutable.Map({
  wizardStage: CONFIG_INIT,
  id: 0,
  name: undefined,
  rows: '4',
  columns: '4',
  stages: '6',
  currentStageBeingSet: 1,
  createdStages: undefined,
  mayNotHaveSubjectImage: true,
  configErrors: []
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function configViewReducer(state = configViewState, action = null) {
  switch (action.type) {
    case TOGGLE_MAY_NOT_HAVE_IMAGE:
    {
      return state.set('mayNotHaveSubjectImage', !state.get('mayNotHaveSubjectImage'));
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
          return state.set('wizardStage', (state.get('wizardStage') + 1));
        } else {
          return state.set('currentStageBeingSet', (state.get('currentStageBeingSet') + 1));
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
