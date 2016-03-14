import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';
import TestView from 'views/TestView/TestView';
import AdminView from 'views/AdminView/AdminView';
import SubjectView from 'views/SubjectView/SubjectView';
import SubjectSelectView from 'views/SubjectView/SubjectSelectView';
import NewSubjectView from 'views/SubjectView/NewSubjectView';
import SubjectProfileView from 'views/SubjectView/SubjectProfileView';
import SubjectUploadView from 'views/SubjectUploadView/SubjectUploadView';
import NotFoundView from 'views/NotFoundView/NotFoundView';

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path='test' component={TestView} />
    <Route path='collections' component={SubjectUploadView} />
    <Route path='admin' component={AdminView} />
    <Route path='subjects' component={SubjectView}>
      <IndexRoute component={SubjectSelectView}/>
      <Route path='new' component={NewSubjectView} />
      <Route path=':id' component={SubjectProfileView} />
    </Route>
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
);
