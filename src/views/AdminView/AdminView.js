import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import Sidebar from 'react-sidebar';
import { actions as viewActions } from '../../redux/modules/adminView';
import classes from './AdminView.scss';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  viewState: state.adminView
});
export class AdminView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <div>
          <h1>Admin</h1>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(AdminView);
