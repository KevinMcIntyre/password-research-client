import React from 'react';
import { Modal } from 'react-bootstrap';

export default class UserImageModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Pass Images
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h2>Oh Hai</h2>
          </Modal.Body>
      </Modal>
    );
  }
}
