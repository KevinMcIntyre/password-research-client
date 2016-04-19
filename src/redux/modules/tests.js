import { Map } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------
const SET_SUBJECT = 'SET_SUBJECT';
const SET_TEST = 'SET_TEST';
const INCREMENT_WIZARD = 'INCREMENT_WIZARD';
const DECREMENT_WIZARD = 'DECREMENT_WIZARD';
const RESET_TEST_SETUP = 'RESET_TEST_SETUP';

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
export const setSubject = (subjectId) => ({type: SET_SUBJECT, subjectId: subjectId});
export const setTest = (testType) => ({type: SET_TEST, testType: testType});
export const incrementWizard = () => ({type: INCREMENT_WIZARD});
export const decrementWizard = () => ({type: DECREMENT_WIZARD});
export const resetTestSetup = () => ({type: RESET_TEST_SETUP});

export const actions = {
  setSubject,
  setTest,
  incrementWizard,
  decrementWizard,
  resetTestSetup
};

// ------------------------------------
// State
// ------------------------------------
const testViewState = Map({
  subject: undefined,
  wizardStage: SUBJECT_SELECT,
  testType: undefined,
  subjectSelectError: false,
  testTypeError: false,
  imageTestOption: -1,
  imageTestOptionList: [{
    value: -1,
    label: 'Default'
  }]
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function testViewReducer(state = testViewState, action = null) {
  switch (action.type) {
    case SET_SUBJECT: {
      if (state.get('subjectSelectError')) {
        state = state.set('subjectSelectError', false);
      }
      return state.set('subject', action.subjectId);
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
        if (state.get('subject') === undefined) {
          state = state.set('subjectSelectError', true);
        } else {
          state = state.set('subjectSelectError', false);
        }
        if (state.get('testType') === undefined) {
          state = state.set('testTypeError', true);
        } else {
          state = state.set('testTypeError', false);
        }
        if (state.get('subject') === undefined || state.get('testType') === undefined) {
          return state;
        }
        if (state.get('testType') === 'image') {
          return state.set('wizardStage', IMAGEPASS_SETUP).set('subjectSelectError', false);
        } else {
          return state.set('wizardStage', CONFIRMATION).set('subjectSelectError', false);
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
