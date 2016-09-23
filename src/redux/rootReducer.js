import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import app from './modules/app';
import subjects from './modules/subjects';
import tests from './modules/tests';
import images from './modules/images';
import config from './modules/config';
import trials from './modules/trials';

export default combineReducers({
  router,
  app,
  subjects,
  tests,
  images,
  config,
  trials
});
