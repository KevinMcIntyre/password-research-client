import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from 'react-spinkit';
import PassImage from '../../../components/PassImage/PassImage';
import Icon from 'react-fa';
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
          <Modal.Body className={classes.trialDetailModalBody}>
            {this.props.trialDetailsLoading ?
            <div className={'text-center ' + classes.loading}>
              <h2>Fetching trial details...</h2>
              <Spinner spinnerName='three-bounce' noFadeIn={true}/>
            </div>
            :
            <div className={classes.trialDetailContainer}>
              { isImageTrial ?
                <div className={classes.trialDetails}>
                  {this.props.trialDetails.map(trialDetail => {
                    return (
                      <div className={classes.trialDetail} key={trialDetail.stage}>
                        <h4>Stage #{trialDetail.stage}</h4>
                        <p className={classes.detailLabel}>Image Selected: </p>
                        {trialDetail.selectedAlias ?
                          <PassImage img={`http://localhost:7000/test/image/${trialDetail.selectedAlias}`}/>
                          :
                          <p>No pass-image selected</p>
                        }
                        <p className={classes.detailLabel}>Correct Image(s): </p>
                        <div>
                          {
                            trialDetail.correctAlias.length > 0 ?
                              trialDetail.correctAlias.map((alias, index) => {
                                return <PassImage key={index} img={`http://localhost:7000/test/image/${alias}`}/>
                              })
                              :
                              <p>No pass-images present</p>
                          }
                        </div>
                        <p className={classes.detailLabel}>Correctly chosen: {trialDetail.success ? <Icon className={classes.green} name='check' /> : <Icon className={classes.red} name='times' />} </p>
                        <p className={classes.detailLabel}>Time spent on stage: {trialDetail.timeSpentInSeconds} seconds</p>
                      </div>
                    )
                  })}
                </div>
                :
                <div className={classes.trialDetails}>
                  {this.props.trialDetails.map(trialDetail => {
                    return (
                      <div className={classes.trialDetail} key={trialDetail.attemptNumber}>
                        <h4>Attempt #{trialDetail.attemptNumber}</h4>
                        <div className={classes.trialDetailLabels}>
                          <p className={classes.detailLabel}>Password Entered: {trialDetail.passwordEntered}</p>
                          <p className={classes.detailLabel}>Correct Password: {trialDetail.correctPassword}</p>
                          <p className={classes.detailLabel}>Success: {trialDetail.success ? <Icon className={classes.green} name='check' /> : <Icon className={classes.red} name='times' />} </p>
                          <p className={classes.detailLabel}>Time spent on attempt: {trialDetail.timeSpentInSeconds} seconds</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              }
            </div>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.toggleModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
