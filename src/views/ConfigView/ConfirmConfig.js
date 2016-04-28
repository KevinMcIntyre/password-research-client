import React from 'react';
import { Button, Input } from 'react-bootstrap';
import classes from '../SubjectView/SubjectView.scss';

export default class ConfirmConfig extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Confirm Config</h2>
        </div>
        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.props.decrementWizard}>Back</Button>
          <Button bsSize={'large'} bsStyle={'success'}>Save Test Configuration</Button>
        </div>
      </div>
    );
  }
}
