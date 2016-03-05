import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import counter from './modules/counter';
import app from './modules/app';
import subjectUploadView from './modules/subjectUploadView';

export default combineReducers({
  counter,
  router,
  app,
  subjectUploadView
});
