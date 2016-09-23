import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from 'react-spinkit';
import classes from '../SubjectView.scss';

export default class TrialDetailsModal extends React.Component {
  constructor() {
    super();
  }

  render() {
    let isImageTrial = true;
    if (this.props.trialDetails && this.props.trialDetails[0]) {
      if ('passwordEntered' in this.props.trialDetails[0]) {
        isImageTrial = false;
      }
    }
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Trial Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.trialDetailsLoading ?
            <div className='text-center'>
              <h2>Fetching trial details...</h2>
              <Spinner spinnerName='three-bounce' noFadeIn={true}/>
            </div>
            :
            <div>
              <h1>Hi!</h1>
              { isImageTrial ? <p>This is an image trial!!!</p> : <p>This is not an image trial.</p> }
              <Button onClick={this.props.toggleModal}>Close</Button>
            </div>
            }
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
