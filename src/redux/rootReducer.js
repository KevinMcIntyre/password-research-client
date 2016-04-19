import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import counter from './modules/counter';
import app from './modules/app';
import subjects from './modules/subjects';
import tests from './modules/tests';
import images from './modules/images';
import adminView from './modules/adminView';

export default combineReducers({
  counter,
  router,
  app,
  subjects,
  tests,
  images,
  adminView
});
