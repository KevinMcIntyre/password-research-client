import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import classes from '../SubjectView.scss';

export default class TrialDetailsModal extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Trial Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h1>Hi!</h1>
              <Button onClick={this.props.toggleModal}>Close</Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
