import React from 'react';
import { connect } from 'react-redux';
import { actions as appActions } from '../../redux/modules/app.js';
import { store } from '../../main.js';
import { actions as viewActions } from '../../redux/modules/config';
import { Button } from 'react-bootstrap';
import classes from '../SubjectView/SubjectView.scss';
import testViewClasses from '../TestView/TestView.scss';
import ImageMatrix from '../../components/ImageMatrix/ImageMatrix.js';

export default class SelectedConfig extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <div className={testViewClasses.imageSettingContainer}>
            <div className={testViewClasses.imageTestSettings}>
              <div className={testViewClasses.imageTestSettingsTableContainer}>
                <table>
                  <tbody>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Test Name:
                    </td>
                    <td>
                      {this.props.name}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Matrix size:
                    </td>
                    <td>
                      {this.props.rows} x {this.props.columns}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Number of stages:
                    </td>
                    <td>
                      {this.props.stages}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Show 'None of my pass-images
                      <br/>are displayed here' button
                    </td>
                    <td>
                      {this.props.noneEnabled ? <span>True</span> : <span>False</span>}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div>
          <ImageMatrix rows={parseInt(this.props.rows, 10)}
                       columns={parseInt(this.props.columns, 10)}
                       noneEnabled={this.props.noneEnabled}
                       matrix={this.props.matrix}
                       currentStage={this.props.currentStage}
                       totalStages={this.props.totalStages}
                       onImageClick={this.props.onImageClick}
                       random={false}
            />
        </div>
        <div className={classes.buttonGroup}>
          {this.props.currentStage > 1 ?
            <Button className={classes.backButton} bsSize={'large'} onClick={this.props.decrementStage}>Previous
              Stage</Button> :
            <span></span>
          }
          {this.props.currentStage < this.props.totalStages ?
            <Button bsSize={'large'} onClick={this.props.incrementStage}>Next Stage</Button> :
            <span></span>
          }
        </div>
      </div>
    );
  }
}
