import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
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
export class SubjectSelectView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
  }

  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];
    return (
      <div className='container text-center'>
        <div>
          <h2>Subject Profiles</h2>
        </div>
        <div className={classes.subjectSelect}>
          <h4>Select a subject profile: </h4>
          <Select
            options={options}
            />
        </div>
        <div>
          <h4>Create a new one:</h4>
          <LinkContainer to={{pathname: '/subjects/new'}}>
            <Button bsSize={"large"} bsStyle={"primary"}>Add New Subject</Button>
          </LinkContainer>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectSelectView);
