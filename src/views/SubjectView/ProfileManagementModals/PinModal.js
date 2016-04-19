import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import classes from '../SubjectView.scss';
import PinInput from '../../../components/PinInput/PinInput.js';

export default class PinModal extends React.Component {
  constructor() {
    super();
    this.submitPinNumber = this.submitPinNumber.bind(this);
  }

  submitPinNumber() {
    this.props.savePinNumber({
      subjectId: this.props.subjectId,
      pinNumber: this.refs['keypad'].getValue()
    });
    this.refs['keypad'].clear();
  }

  render() {
    let modalBody;
    if (this.props.pinNumber) {
      modalBody = (
        <div className={classes.imageSettingContainer}>
          <h5>Please hover over the black box to view the user's pin number.</h5>

          <div className={classes.passwordTable}>
            <div className={classes.imageTestSettingsTableContainer}>
              <table>
                <tbody>
                <tr>
                  <td className={classes.optionKey}>
                    Pin Number:
                  </td>
                  <td>
                    {this.props.pinNumber}
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <br/>
          <br/>
          <Button onClick={this.props.toggleModal}>Close</Button>
        </div>
      );
    } else {
      modalBody = (
        <div className='text-center'>
          <h4>A pin number for {this.props.subjectName} is not currently set.</h4>
          <h4>Set a pin number by entering it below.</h4>
          <PinInput ref='keypad'/>
          <br/>
          <Button onClick={this.submitPinNumber} className={classes.saveButton} bsStyle='success'>Save
            Pin Number</Button>
          <Button onClick={this.props.toggleModal}>Cancel</Button>
        </div>
      );
    }
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Pin Number
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalBody}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}
