import React from 'react';
import { Button } from 'react-bootstrap';
import classes from './TrialView.scss';

export default class OutroView extends React.Component {
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.intro}>
          {this.props.successfulAuth ?
            <h1>Congratulations! You've successfully authenticated!</h1>
            :
            <h1>Sorry, you have not successfully authenticated.</h1>
          }
          {this.props.successfulAuth ?
            <h3>Thank you for your participation, {this.props.subjectName}!</h3>
            :
            <h3>Nevertheless, thank you for your participation, {this.props.subjectName}!</h3>
          }
          <h3>We really appreciate it.</h3>
          <br/>
          <div>
            <Button bsStyle='primary' bsSize='large' onClick={this.props.exit}>Exit Testing Mode</Button>
          </div>
        </div>
      </div>
    );
  }
}
