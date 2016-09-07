import React from 'react';
import classes from './TrialView.scss';

export default class OutroView extends React.Component {
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.intro}>
          <h1>Thank you, {this.props.subjectName}.</h1>
        </div>
      </div>
    );
  }
}
