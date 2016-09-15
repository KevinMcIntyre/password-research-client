import React from 'react';
import PinInput from '../../components/PinInput/PinInput.js';
import { Button } from 'react-bootstrap';
import classes from './TrialView.scss';

export default class PinAuthView extends React.Component {
  submit() {
    this.props.submitPinNumber(this.props.trialId, this.refs['keypad'].getValue());
    this.refs['keypad'].clear();
  }
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.authContainer}>
          <h1>You are now attempting to authenticate successfully, {this.props.subjectName}!</h1>
          <div className='text-center'>
            <h4>Please enter your pin number below.</h4>
            <PinInput ref='keypad'/>
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
