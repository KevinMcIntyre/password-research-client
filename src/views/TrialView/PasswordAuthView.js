import React from 'react';
import { Button } from 'react-bootstrap';
import classes from './TrialView.scss';

export default class PasswordAuthView extends React.Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }
  submit() {
    let password = '';
    this.props.submitPinNumber(this.props.trialId, password);
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
            <input type='password'/>
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
