import { Map } from 'immutable';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const SET_ERROR_FIELDS = 'SET_ERROR_FIELDS';
const SAVE_PROFILE = 'SAVE_PROFILE';

// ------------------------------------
// Actions
// ------------------------------------
export const setErrorFields = (issues) => ({type: SET_ERROR_FIELDS, errorFields: issues});

export const saveProfile = (profile) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/subject/new')
      .send(JSON.stringify({
        'firstName': profile.firstName,
        'lastName': profile.lastName,
        'email': profile.email,
        'birthday': profile.birthday
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end()
      .then(function(res) {
        // redirect to new user profile from response id field
        let response = JSON.parse(res.text);
        console.log(response);
      }, function(err) {
        console.log(err);
      });
  };
};

export const actions = {
  setErrorFields,
  saveProfile
};

// ------------------------------------
// State
// ------------------------------------
const subjectViewState = Map({
  'errorFields': []
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function newSubjectViewReducer(state = subjectViewState, action = null) {
  switch (action.type) {
    case SET_ERROR_FIELDS: {
      return state.set('errorFields', action.errorFields);
    }
    default: {
      return state;
    }
  }
}
