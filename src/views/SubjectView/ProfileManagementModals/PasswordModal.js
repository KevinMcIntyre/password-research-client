import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import classes from '../SubjectView.scss';
import PasswordInput from 'react-ux-password-field';

export default class PasswordModal extends React.Component {
  constructor() {
    super();
    this.submitPassword = this.submitPassword.bind(this);
  }

  submitPassword() {
    const passwordInputState = this.refs['passwordfield'].state;
    this.props.savePassword({
      subjectId: this.props.subjectId,
      entropy: passwordInputState.entropy,
      strength: passwordInputState.score,
      password: passwordInputState.value
    });
  }

  render() {
    let modalBody;
    if (this.props.password) {
      modalBody = (
        <div className={classes.imageSettingContainer}>
          <h5>Please hover over the black box to view the user's password information.</h5>

          <div className={classes.passwordTable}>
            <div className={classes.imageTestSettingsTableContainer}>
              <table>
                <tbody>
                <tr>
                  <td className={classes.optionKey}>
                    Password:
                  </td>
                  <td>
                    {this.props.password}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Strength:
                  </td>
                  <td>
                    {this.props.strength}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Entropy:
                  </td>
                  <td>
                    {this.props.entropy}
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
          <h4>A password for {this.props.subjectName} is not currently set.</h4>
          <h4>Set a password in the field below.</h4>
          <PasswordInput id={classes.passwordField}
                         ref='passwordfield'
                         className={classes.passwordInput}
            />
          <br/>
          <Button onClick={this.submitPassword} className={classes.saveButton} bsStyle='success'>Save
            Password</Button>
          <Button onClick={this.props.toggleModal}>Cancel</Button>
        </div>
      );
    }
    return (
      <div>
        <Modal show={this.props.show}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Password
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
