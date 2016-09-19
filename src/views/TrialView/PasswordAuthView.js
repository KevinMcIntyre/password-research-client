import React from 'react';
import { Button } from 'react-bootstrap';
import PasswordInput from '../../components/PasswordInput/PasswordInput';
import classes from './TrialView.scss';

export default class PasswordAuthView extends React.Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }
  submit() {
    this.props.submitPassword(this.props.trialId, this.refs['password-input'].getValue());
    this.refs['password-input'].clear();
  }
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.authContainer}>
          <h1>You are now attempting to authenticate successfully, {this.props.subjectName}!</h1>
          <div className='text-center'>
            <h4>Please enter your password below.</h4>
            {this.props.incorrect ?
              <h4 className={classes.error}>
                The password entered was incorrect.
                You have {this.props.attemptsLeft} {this.props.attemptsLeft == 1 ? 'attempt' : 'attempts'} left.
              </h4> : ''
            }
            {this.props.blank ?
              <h4 className={classes.error}>
                Please enter a password.
              </h4> : ''
            }
            <div>
              <PasswordInput ref='password-input' />
            </div>
            <br/>
            <Button onClick={this.submit}
                    className={classes.submitPinButton}
                    bsSize='large'
                    bsStyle='success'>
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
