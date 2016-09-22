import { Map } from 'immutable';
import { setLoadingState } from './app.js';
import { push } from 'react-router-redux';
import _agent from 'superagent';
import _promise from 'bluebird';
import _agent_promise from 'superagent-promise';

const agent = _agent_promise(_agent, _promise);

// ------------------------------------
// Constants
// ------------------------------------
const ADD_SUBJECT = 'ADD_SUBJECT';
const SET_SUBJECTS = 'SET_SUBJECTS';
const SET_PROFILE = 'SET_PROFILE';
const SET_NEW_SUBJECT_ERRORS = 'SET_NEW_SUBJECT_ERRORS';
const SET_PASSWORD = 'SET_PASSWORD';
const SET_PIN_NUMBER = 'SET_PIN_NUMBER';
const SET_USER_HAS_IMAGES_TO_TRUE = 'SET_USER_HAS_IMAGES_TO_TRUE';
const SET_SUBJECT_TRIALS = 'SET_SUBJECT_TRIALS';
const SET_TRIAL_DETAILS = 'SET_TRIAL_DEETS';
const TOGGLE_PASSWORD_MODAL = 'TOGGLE_PASSWORD_MODAL';
const TOGGLE_PIN_MODAL = 'TOGGLE_PIN_MODAL';
const TOGGLE_PASSIMAGE_MODAL = 'TOGGLE_PASSIMAGE_MODAL';
const TOGGLE_TRIAL_DETAILS_MODAL = 'TOGGLE_TRIAL_DETAILS_MODAL';

// ------------------------------------
// Actions
// ------------------------------------
export const setUserHasImagesToTrue = (subjectId) => ({type: SET_USER_HAS_IMAGES_TO_TRUE, subjectId: subjectId});
export const toggleTrialDetailsModal = () => ({type: TOGGLE_TRIAL_DETAILS_MODAL});
export const togglePassImageModal = () => ({type: TOGGLE_PASSIMAGE_MODAL});
export const togglePinModal = () => ({type: TOGGLE_PIN_MODAL});
export const setTrialDetails = (trialDetails) => ({type: SET_TRIAL_DETAILS, trialDetails: trialDetails});
export const setPinNumber = (subjectId, pinNumber) => ({type: SET_PIN_NUMBER, subjectId: parseInt(subjectId, 10), pinNumber: pinNumber});
export const savePinNumber = (request) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/subject/save/pin')
      .field('subjectId', request.subjectId)
      .field('pinNumber', request.pinNumber)
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          dispatch(setPinNumber(request.subjectId, request.pinNumber));
        }
      });
  };
};
export const togglePasswordModal = () => ({type: TOGGLE_PASSWORD_MODAL});
export const setPassword = (subjectId, password, entropy, strength) => ({type: SET_PASSWORD, subjectId: parseInt(subjectId, 10), password: password, entropy: entropy, strength: strength});
export const savePassword = (request) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/subject/save/password')
      .field('subjectId', request.subjectId)
      .field('password', request.password)
      .field('entropy', request.entropy)
      .field('strength', request.strength)
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          dispatch(setPassword(request.subjectId, request.password, request.entropy, request.strength));
        }
      });
  };
};
export const setProfile = (profile) => ({type: SET_PROFILE, profile: profile});
export const setSubjects = (subjects) => ({type: SET_SUBJECTS, subjects: subjects});
export const addSubject = (subject) => ({type: ADD_SUBJECT, subject: subject});
export const setErrorFields = (issues) => ({type: SET_NEW_SUBJECT_ERRORS, newSubjectErrors: issues});
export const loadSubjects = () => {
  return dispatch => {
    return agent
      .get('http://localhost:7000/subject/list')
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setSubjects(response));
          setTimeout(function() {
            dispatch(setLoadingState(false));
          }, 1000);
        }
      });
  };
};
export const setSubjectTrials = (trials) => ({type: SET_SUBJECT_TRIALS, trials: trials});
export const loadProfile = (userId) => {
  return dispatch => {
    agent
      .get('http://localhost:7000/subject/profile/' + userId)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setProfile({
            firstName: response.FirstName,
            lastName: response.LastName,
            email: response.Email,
            birthday: response.Birthday,
            password: response.Password.Valid ? response.Password.String : undefined,
            passwordStrength: response.PasswordStrength.Valid ? response.PasswordStrength.Int64 : undefined,
            passwordEntropy: response.PasswordEntropy.Valid ? response.PasswordEntropy.Float64 : undefined,
            pinNumber: response.PinNumber.Valid ? response.PinNumber.String : undefined
          }));
          setTimeout(function() {
            dispatch(setLoadingState(false));
          }, 1000);
        }
      });
    agent
      .get('http://localhost:7000/subject/trials/' + userId)
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(setSubjectTrials(response));
        }
      });
  };
};
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
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          dispatch(addSubject({
            value: response.id,
            label: profile.lastName + ', ' + profile.firstName
          }));
          dispatch(push('/subjects/' + response.id));
        }
      });
  };
};

export const loadTrialDetails = (trialType, trialId) => {
  return dispatch => {
    return agent
      .post('http://localhost:7000/trial/details')
      .send(JSON.stringify({
        'trialId': trialId,
        'isImageTrial': (trialType === 'Pass-Image')
      }))
      .set({
        'Access-Control-Allow-Origin': 'localhost:7000'
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
        } else {
          const response = JSON.parse(res.text);
          const alteredResponse = response.map((resObj) => {
            let selectedAlias = resObj['selectedAlias'];
            let correctAlias = resObj['correctAlias'];
            if (selectedAlias && selectedAlias.length < 1) {
              selectedAlias = null;
            }
            if (correctAlias && correctAlias.length === 1 && correctAlias[0] === "") {
              correctAlias = [];
            }
            return {...resObj, selectedAlias, correctAlias};
          });
          dispatch(setTrialDetails(alteredResponse));
        }
      });
  };
};

export const actions = {
  loadSubjects,
  setSubjects,
  addSubject,
  loadProfile,
  loadTrialDetails,
  setProfile,
  setErrorFields,
  saveProfile,
  savePassword,
  savePinNumber,
  togglePasswordModal,
  togglePinModal,
  togglePassImageModal,
  toggleTrialDetailsModal
};

// ------------------------------------
// State
// ------------------------------------
const subjectListViewState = Map({
  subjectList: [],
  subjectMap: Map({}),
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  birthday: undefined,
  password: undefined,
  passwordEntropy: undefined,
  passwordStrength: undefined,
  pinNumber: undefined,
  newSubjectErrors: [],
  showPasswordModal: false,
  showPinModal: false,
  showPassImageModal: false,
  showTrialDetailsModal: false,
  trials: [],
  trialDetails: undefined
});
// ------------------------------------
// Reducer
// ------------------------------------
export default function subjectListViewReducer(state = subjectListViewState, action = null) {
  switch (action.type) {
    case SET_TRIAL_DETAILS: {
      return state.set('trialDetails', action.trialDetails);
    }
    case SET_SUBJECT_TRIALS: {
      if (action.trials && typeof action.trials === 'object' && action.trials.length > 0) {
        return state.set('trials', action.trials);
      }
      return state.set('trials', []);
    }
    case SET_USER_HAS_IMAGES_TO_TRUE: {
      let subjectMap = state.get('subjectMap');
      const subjectData = subjectMap.get(action.subjectId);
      subjectMap = subjectMap.set(action.subjectId, subjectData.set('hasImages', true));
      return state.set('subjectMap', subjectMap);
    }
    case TOGGLE_TRIAL_DETAILS_MODAL: {
      const modalState = state.get('showTrialDetailsModal');
      return state.set('showTrialDetailsModal', !modalState);
    }
    case TOGGLE_PASSIMAGE_MODAL: {
      const modalState = state.get('showPassImageModal');
      return state.set('showPassImageModal', !modalState);
    }
    case TOGGLE_PIN_MODAL: {
      const modalState = state.get('showPinModal');
      return state.set('showPinModal', !modalState);
    }
    case SET_PIN_NUMBER: {
      let subjectMap = state.get('subjectMap');
      const subjectData = subjectMap.get(action.subjectId);
      subjectMap = subjectMap.set(action.subjectId, subjectData.set('hasPin', true));
      return state
        .set('subjectMap', subjectMap)
        .set('pinNumber', action.pinNumber);
    }
    case TOGGLE_PASSWORD_MODAL: {
      const modalState = state.get('showPasswordModal');
      return state.set('showPasswordModal', !modalState);
    }
    case SET_PASSWORD: {
      let subjectMap = state.get('subjectMap');
      const subjectData = subjectMap.get(action.subjectId);
      subjectMap = subjectMap.set(action.subjectId, subjectData.set('hasPassword', true));
      return state
        .set('subjectMap', subjectMap)
        .set('password', action.password)
        .set('passwordEntropy', action.entropy)
        .set('passwordStrength', action.strength);
    }
    case SET_SUBJECTS: {
      let subjectList = [];
      if (action.subjects) {
        let subjectMap = state.get('subjectMap');
        action.subjects.map((subject) => {
          subjectList.push({value: subject.Id, label: subject.Name});
          let splitName = subject.Name.split(', ');
          subjectMap = subjectMap.set(subject.Id, Map({
            name: splitName[1] + ' ' + splitName[0],
            hasPassword: subject.PasswordSet,
            hasPin: subject.PinSet,
            hasImages: subject.ImagesSet
          }));
        });
        state = state.set('subjectMap', subjectMap);
      }
      return state.set('subjectList', subjectList);
    }
    case ADD_SUBJECT: {
      let newSubjectList = state.get('subjectList');
      newSubjectList.push(action.subject);
      newSubjectList.sort((a, b) => {
        if (a.label.toLowerCase() < b.label.toLowerCase()) {
          return -1;
        }
        if (a.label.toLowerCase() > b.label.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      state = state.set('subjectMap', state.get('subjectMap').set(action.subject.value, Map({
        name: action.subject.label,
        hasPassword: false,
        hasPin: false,
        hasImages: false
      })));
      return state.set('subjectList', newSubjectList);
    }
    case SET_PROFILE: {
      return state
        .set('firstName', action.profile.firstName)
        .set('lastName', action.profile.lastName)
        .set('email', action.profile.email)
        .set('birthday', action.profile.birthday)
        .set('password', action.profile.password)
        .set('passwordStrength', action.profile.passwordStrength)
        .set('passwordEntropy', action.profile.passwordEntropy)
        .set('pinNumber', action.profile.pinNumber);
    }
    case SET_NEW_SUBJECT_ERRORS: {
      return state.set('newSubjectErrors', action.newSubjectErrors);
    }
    default: {
      return state;
    }
  }
}
