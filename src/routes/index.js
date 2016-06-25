import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

// NOTE: here we're making use of the `resolve.root` configuration
// option in webpack, which allows us to specify import paths as if
// they were from the root of the ~/src directory. This makes it
// very easy to navigate to files regardless of how deeply nested
// your current file is.
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import HomeView from 'views/HomeView/HomeView';
import TestSetupView from 'views/TestView/TestSetupView';
import SubjectView from 'views/SubjectView/SubjectView';
import SubjectSelectView from 'views/SubjectView/SubjectSelectView';
import NewSubjectView from 'views/SubjectView/NewSubjectView';
import SubjectProfileView from 'views/SubjectView/SubjectProfileView';
import CollectionView from 'views/CollectionView/CollectionView';
import CollectionSelectView from 'views/CollectionView/CollectionSelectView';
import NewCollectionView from 'views/CollectionView/NewCollectionView';
import CollectionUploadView from 'views/CollectionView/CollectionUploadView';
import ConfigView from 'views/ConfigView/ConfigView';
import ConfigSelect from 'views/ConfigView/ConfigSelect';
import SelectedConfigView from 'views/ConfigView/SelectedConfigView';
import NotFoundView from 'views/NotFoundView/NotFoundView';

export default (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={HomeView} />
    <Route path='test' component={TestSetupView} />
    <Route path='collections' component={CollectionView}>
      <IndexRoute component={CollectionSelectView}/>
      <Route path='new' component={NewCollectionView} />
      <Route path=':collectionId' component={CollectionUploadView} />
    </Route>
    <Route path='subjects' component={SubjectView}>
      <IndexRoute component={SubjectSelectView}/>
      <Route path='new' component={NewSubjectView} />
      <Route path=':subjectId' component={SubjectProfileView} />
    </Route>
    <Route path='configurations'>
      <IndexRoute component={ConfigSelect} />
      <Route path='new' component={ConfigView} />
      <Route path=':configId' component={SelectedConfigView} />
    </Route>
    <Route path='/404' component={NotFoundView} />
    <Redirect from='*' to='/404' />
  </Route>
);
