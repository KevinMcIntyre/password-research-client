import { List, Map } from 'immutable';

// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

// ------------------------------------
// State
// ------------------------------------
const appState = Map({
  'settings': Map({
    'matrixRows': 4,
    'matrixCols': 4,
    'authStages': 6
  }),
  'session': Map({
    'id': 1,
    'adminId': 1,
    'userId': 1
  }),
  'admin': Map({
    'id': 1,
    'firstName': 'Kevin',
    'lastName': 'McIntyre'
  }),
  'subject': Map({
    'id': 1,
    'firstName': 'Johnny',
    'lastName': 'Test'
  }),
  'trial': Map({
    'id': 1,
    'subjectId': 1,
    'stage': 1,
    'trialType': 'image',
    'imageMatrices': Map({}),
    'selectedImages': List()
  })
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function appReducer(state = appState, action = null) {
  switch (action.type) {
    default: {
      return state;
    }
  }
}
