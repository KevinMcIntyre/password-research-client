import React from 'react';
import classes from './TrialView.scss';

export default class PasswordAuthView extends React.Component {
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.authContainer}>
          <h1>You are now attempting to authenticate successfully, {this.props.subjectName}!</h1>
        </div>
      </div>
    );
  }
}
