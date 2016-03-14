import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { actions as viewActions } from '../../redux/modules/subjectView';
import classes from './SubjectView.scss';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  viewState: state.adminView
});
export class SubjectProfileView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
  }

  render() {
    return (
      <div className='container text-center'>
        <h1>Subject Profile</h1>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectProfileView);
