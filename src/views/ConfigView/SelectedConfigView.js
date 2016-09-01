import React from 'react';
import { connect } from 'react-redux';
import { actions as appActions } from '../../redux/modules/app.js';
import { store } from '../../main.js';
import { actions as viewActions } from '../../redux/modules/config';
import { Button } from 'react-bootstrap';
import classes from '../SubjectView/SubjectView.scss';
import testViewClasses from '../TestView/TestView.scss';
import ImageMatrix from '../../components/ImageMatrix/ImageMatrix.js';


const mapStateToProps = (state) => ({
  viewState: state.config
});

export default class SelectedConfigView extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (this.props.viewState.get('configs').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Loading configuration'));
    }
  }

  componentDidMount() {
    let { configId } = this.props.params;
    if (this.props.viewState.get('configs').length === 0) {
      this.props.loadConfigs(configId);
    } else {
      if (!this.props.viewState.get('configId')) {
        this.props.viewState.get('configs').map(config => {
          if (config.value === configId) {
            this.props.selectConfig({
              id: configId,
              label: config.label
            });
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.clearForm();
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Pass-Image Test Configuration: {this.props.viewState.get("name")}</h2>
        </div>
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
                      {this.props.viewState.get('name')}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Matrix size:
                    </td>
                    <td>
                      {this.props.viewState.get('rows')} x {this.props.viewState.get('columns')}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
                      Number of stages:
                    </td>
                    <td>
                      {this.props.viewState.get('stages')}
                    </td>
                  </tr>
                  <tr>
                    <td className={testViewClasses.optionKey}>
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
        </div>
        <div>
          <ImageMatrix rows={parseInt(this.props.viewState.get('rows'), 10)}
                       columns={parseInt(this.props.viewState.get('columns'), 10)}
                       noneEnabled={this.props.viewState.get('mayNotHaveSubjectImage')}
                       matrix={this.props.viewState.get('createdStages') != undefined ? this.props.viewState.get('createdStages').get(this.props.viewState.get('currentStageBeingSet').toString()) : undefined}
                       currentStage={this.props.viewState.get('currentStageBeingSet')}
                       totalStages={this.props.viewState.get('stages')}
                       onImageClick={undefined}
                       random={false}
            />
        </div>
        <div className={classes.buttonGroup}>
          {this.props.viewState.get("currentStageBeingSet") > 1 ?
            <Button className={classes.backButton} bsSize={'large'} onClick={this.props.decrementStage}>Previous
              Stage</Button> :
            <span></span>
          }
          {this.props.viewState.get("currentStageBeingSet") < this.props.viewState.get('stages') ?
            <Button bsSize={'large'} onClick={this.props.incrementStage}>Next Stage</Button> :
            <span></span>
          }
        </div>
      </div>
    );
  }
}