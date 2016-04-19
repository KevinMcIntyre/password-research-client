import React from 'react';
import { store } from '../../main';
import { actions as appActions } from '../../redux/modules/app';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Select from 'react-select';
import { actions as viewActions } from '../../redux/modules/subjects';
import classes from './SubjectView.scss';

const mapStateToProps = (state) => ({
  viewState: state.subjects
});
export class SubjectSelectView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.selectSubject = this.selectSubject.bind(this);
  }

  componentWillMount() {
    if (this.props.viewState.get('subjectList').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Getting subjects'));
    }
  }

  componentDidMount() {
    if (this.props.viewState.get('subjectList').length === 0) {
      this.props.loadSubjects();
    }
  }

  selectSubject({value}) {
    store.dispatch(push('/subjects/' + value));
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Subject Profiles</h2>
        </div>
        <div className={classes.subjectSelect}>
          <h4>Select a subject profile: </h4>
          <Select
            options={this.props.viewState.get('subjectList')}
            onChange={this.selectSubject}
            />
        </div>
        <div>
          <h4>Create a new one:</h4>
          <LinkContainer to={{pathname: '/subjects/new'}}>
            <Button bsSize={'large'} bsStyle={'primary'}>Add New Subject</Button>
          </LinkContainer>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectSelectView);
