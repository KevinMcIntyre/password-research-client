import React from 'react';
import { Button, Input } from 'react-bootstrap';
import classes from '../TestView/TestView.scss';

export default class ConfirmConfig extends React.Component {
  constructor() {
    super();
    this.saveConfig = this.saveConfig.bind(this);
  }

  saveConfig() {
    this.props.saveConfig(
      this.props.viewState.get("configId"),
      this.props.viewState.get("name"),
      this.props.viewState.get("stages"),
      this.props.viewState.get("rows"),
      this.props.viewState.get("columns"),
      this.props.viewState.get("mayNotHaveSubjectImage"),
      this.props.viewState.get("createdStages")
    );
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Confirm Configuration</h2>
        </div>
        <p>
          Below are the test configuration settings for your review.
          <br/>
          Please review them, along with the previously set image stages, as neither will be able to be changed after
          saving.
        </p>

        <div>
          <div className={classes.imageSettingContainer}>
            <div className={classes.imageTestSettings}>
              <div className={classes.imageTestSettingsTableContainer}>
                <table>
                  <tbody>
                  <tr>
                    <td className={classes.optionKey}>
                      Test Name:
                    </td>
                    <td>
                      {this.props.viewState.get('name')}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.optionKey}>
                      Matrix size:
                    </td>
                    <td>
                      {this.props.viewState.get('rows')} x {this.props.viewState.get('columns')}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.optionKey}>
                      Number of stages:
                    </td>
                    <td>
                      {this.props.viewState.get('stages')}
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.optionKey}>
                      Show 'None of my pass-images
                      <br/>are displayed here' button
                    </td>
                    <td>
                      {this.props.viewState.get('mayNotHaveSubjectImage') ? <span>True</span> : <span>False</span>}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p>
            <br/>
            If you want to make changes, click <b>Back</b> in order to make any changes.
            <br/>
            If you're happy with these settings, click <b>Save Test Configuration</b> to make this configuration
            available for testing.
          </p>
        </div>
        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.props.decrementWizard}>Back</Button>
          <Button bsSize={'large'} bsStyle={'success'} onClick={this.saveConfig}>Save Test Configuration</Button>
        </div>
      </div>
    );
  }
}
