import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import { store } from '../../main';
import UserImageModal from './UserImageModal';
import { actions as appActions } from '../../redux/modules/app';
import { actions as viewActions, wizardStages } from '../../redux/modules/tests';
import { actions as subjectActions } from '../../redux/modules/subjects';
import { actions as configActions } from '../../redux/modules/config';
import ConfigBox from './ConfigBox.js';
import ImageMatrix from '../../components/ImageMatrix/ImageMatrix';
import Select from 'react-select';
import classes from './TestView.scss';

const mapStateToProps = (state) => ({
  viewState: state
});
export class TestSetupView extends React.Component {
  constructor() {
    super();
    this.setSubject = this.setSubject.bind(this);
    this.setTest = this.setTest.bind(this);
    this.setConfig = this.setConfig.bind(this);
    this.renderSubjectSelect = this.renderSubjectSelect.bind(this);
    this.renderImagePassSetup = this.renderImagePassSetup.bind(this);
    this.renderConfirmation = this.renderConfirmation.bind(this);
    this.wizardNextButton = this.wizardNextButton.bind(this);
    this.wizardBackButton = this.wizardBackButton.bind(this);
    this.incrementStage = this.incrementStage.bind(this);
    this.decrementStage = this.decrementStage.bind(this);
    this.setUserImage = this.setUserImage.bind(this);
    this.startTrial = this.startTrial.bind(this);
  }

  startTrial() {
    this.props.startTrial(
      this.props.viewState.tests.get('subjectId'),
      this.props.viewState.config.get('configId'),
      this.props.viewState.config.get('stages'),
      this.props.viewState.config.get('rows'),
      this.props.viewState.config.get('columns'),
      this.props.viewState.config.get('mayNotHaveSubjectImage'),
      this.props.viewState.config.get('createdStages'),
      this.props.viewState.tests.get('config').get('userImages')
    );
  }

  setUserImage(selectIndex, alias) {
    this.props.selectUserImage(selectIndex, alias);

    const imagesForSelection = this.props.viewState.tests.get('config').get('userImages');
    let selectedImage;
    for (let i = 0; i < imagesForSelection.length; i++) {
      if (imagesForSelection[i].get('id') === selectIndex) {
        selectedImage = imagesForSelection[i];
      }
    }

    store.dispatch(
      configActions.setSpecificImageInMatrix(
        selectedImage.get('stage'),
        selectedImage.get('row'),
        selectedImage.get('column'),
        alias
      )
    )
  }

  incrementStage() {
    store.dispatch(configActions.incrementStage());
  }

  decrementStage() {
    store.dispatch(configActions.decrementStage());
  }

  wizardNextButton() {
    this.props.incrementWizard();
  }

  wizardBackButton() {
    this.props.decrementWizard();
  }

  componentWillMount() {
    if (this.props.viewState.subjects.get('subjectList').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Getting subjects'));
    }
    if (this.props.viewState.tests.get('imageTestOptionList').length === 0) {
      store.dispatch(appActions.setLoadingState(true, 'Getting test configurations'));
    }
  }

  componentDidMount() {
    if (this.props.viewState.subjects.get('subjectList').length === 0) {
      store.dispatch(subjectActions.loadSubjects());
    }
    if (this.props.viewState.tests.get('imageTestOptionList').length === 0) {
      store.dispatch(viewActions.loadConfigs());
    }
  }

  componentWillUnmount() {
    this.props.resetTestSetup();
  }

  setSubject(subject) {
    if (subject) {
      this.props.selectSubject(subject.value, this.props.viewState.subjects.get('subjectMap').get(subject.value));
    } else {
      this.props.selectSubject(undefined);
    }
  }

  setConfig(config) {
    if (config) {
      this.props.loadConfigSettings(config.value);
      store.dispatch(configActions.loadConfigImages(config.value));
    } else {
      this.props.loadConfigSettings(undefined);
    }
  }

  setTest(testType) {
    this.props.setTest(testType);
  }

  renderSubjectSelect() {
    return (
      <div className='container text-center'>
        <h3>Please select a subject and authentication test below:</h3>
        <br/>

        <div className={classes.subjectSelect}>
          <h4 className={this.props.viewState.tests.get('subjectSelectError') ? classes.testSetupErrorHeading : ''}>
            Select a subject: </h4>
          <Select
            value={this.props.viewState.tests.get('subjectId')}
            options={this.props.viewState.subjects.get('subjectList')}
            onChange={this.setSubject}
            />
          {this.props.viewState.tests.get('subjectSelectError')
            ? <p className={classes.testSetupErrorText}>Please select the subject that will be testing to continue.</p>
            : <span></span>
          }

        </div>
        <h4 className={this.props.viewState.tests.get('testTypeError') ? classes.testSetupErrorHeading : ''}>Select an
          authentication test: </h4>

        <div className={classes.radioContainer}>
          <div className='form-group'>
            <Input ref='image' className={classes.radioButton} name='test' type='radio' standAlone={true}
                   label='Pass-Image'
                   value='image' checked={this.props.viewState.tests.get('testType') === 'image'}
                   onChange={this.setTest.bind(this, 'image')}/>
            <Input ref='password' className={classes.radioButton} name='test' type='radio' standAlone={true}
                   label='Password'
                   value='password' checked={this.props.viewState.tests.get('testType') === 'password'}
                   onChange={this.setTest.bind(this, 'password')}/>
            <Input ref='pin' className={classes.radioButton} name='test' type='radio' standAlone={true}
                   label='Pin Number'
                   value='pin' checked={this.props.viewState.tests.get('testType') === 'pin'}
                   onChange={this.setTest.bind(this, 'pin')}/>
          </div>
        </div>
        {this.props.viewState.tests.get('testTypeError')
          ? <p className={classes.testSetupErrorText}>Please select the type of test to continue.</p> : <span></span>
        }
        <div className={classes.buttonGroup}>
          <Button bsSize={'large'} onClick={this.wizardNextButton}>Next</Button>
        </div>
      </div>
    );
  }

  renderImagePassSetup() {
    let configbox;
    if (this.props.viewState.tests.get('imageTestOption')) {
      configbox = <ConfigBox
                    configName={this.props.viewState.tests.get('config').get('name')}
                    rows={this.props.viewState.tests.get('config').get('rows')}
                    columns={this.props.viewState.tests.get('config').get('columns')}
                    stages={this.props.viewState.tests.get('config').get('stages')}
                    imageMayNotBePresent={this.props.viewState.tests.get('config').get('imageMayNotBePresent')}
                    userImages={this.props.viewState.tests.get('config').get('userImages')}
                    setSelectingImageId={this.props.setUserImageSelect}
                  />;
    } else {
      configbox = <div></div>;
    }
    return (
      <div className='container text-center'>
        <h3>Pass-Image Test Setup</h3>
        <br/>
        <h4>Select a test configuration from the dropdown below.</h4>
        <h4>After selecting your configuration, set the user images by clicking 'Set Image'.</h4>
        <h4>Option sets can be created in the 'Administration' section under 'Preferences'</h4>
        <br/>

        <div className={classes.subjectSelect}>
          <Select
            value={this.props.viewState.tests.get('imageTestOption')}
            options={this.props.viewState.tests.get('imageTestOptionList')}
            onChange={this.setConfig}
          />
        </div>
        {configbox}
        {this.props.viewState.tests.get('noConfigSelectedError') ?
          <div>
            <h4 className={classes.testSetupErrorText}>Please select a test configuration to continue.</h4>
          </div> :
          <span></span>
        }
        {this.props.viewState.tests.get('userPassImageError') ?
          <div>
            <br/>
            <h4 className={classes.testSetupErrorText}>All user pass-images within the configuration must be set before continuing.</h4>
          </div> :
          <span></span>
        }
        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.wizardBackButton}>Back</Button>
          <Button bsSize={'large'} onClick={this.wizardNextButton}>Next</Button>
        </div>
        <UserImageModal
          show={true}
          subjectName={this.props.viewState.tests.get('subjectName')}
          subjectImages={this.props.viewState.tests.get('subjectImages')}
          selectingImageId={this.props.viewState.tests.get('selectingImageId')}
          closeModal={this.props.setUserImageSelect.bind(null, undefined)}
          selectImage={this.setUserImage}
        />
      </div>
    );
  }

  renderConfirmation() {
    return (
      <div className='container text-center'>
        <h3>Confirm Trial Settings</h3>
        {
          this.props.viewState.tests.get('testType') === 'image' ?
          <div>
            <h4>The subject will be presented with the following authentication test: </h4>
            <ImageMatrix rows={parseInt(this.props.viewState.config.get('rows'), 10)}
                         columns={parseInt(this.props.viewState.config.get('columns'), 10)}
                         noneEnabled={this.props.viewState.config.get('mayNotHaveSubjectImage')}
                         matrix={this.props.viewState.config.get('createdStages') != undefined ?
                           this.props.viewState.config.get('createdStages').get(this.props.viewState.config.get('currentStageBeingSet').toString()) :
                           undefined}
                         currentStage={this.props.viewState.config.get('currentStageBeingSet')}
                         totalStages={this.props.viewState.config.get('stages')}
                         onImageClick={undefined}
                         random={false}
            />
            <div className={classes.buttonGroup}>
              {this.props.viewState.config.get("currentStageBeingSet") > 1 ?
                <Button className={classes.backButton} bsSize={'large'} onClick={this.decrementStage}>Previous
                  Stage</Button> :
                <span></span>
              }
              {this.props.viewState.config.get("currentStageBeingSet") < this.props.viewState.config.get('stages') ?
                <Button bsSize={'large'} onClick={this.incrementStage}>Next Stage</Button> :
                <span></span>
              }
            </div>
            <h4>Please review the image matrix for each stage to ensure you are satisfied.</h4>
          </div> :
            <div className={classes.imageSettingContainer}>
              <div className={classes.imageTestSettings}>
                <div className={classes.imageTestSettingsTableContainer}>
                  <table>
                    <tbody>
                    <tr>
                      <td className={classes.optionKey}>
                        Subject:
                      </td>
                      <td>
                        {this.props.viewState.tests.get('subjectName')}
                      </td>
                    </tr>
                    <tr>
                      <td className={classes.optionKey}>
                        Authentication Type:
                      </td>
                      <td>
                        {this.props.viewState.tests.get('testType') === 'password' ? 'Password' : ''}
                        {this.props.viewState.tests.get('testType') === 'pin' ? 'Pin Number' : ''}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        }
        <br/>

        <div className={classes.confirmationWarning}>
          <p>
            <span className={classes.warningHeading}>WARNING: </span>Clicking 'Start Trial' will put the application
            into testing mode.
          </p>

          <p>
            A trial record will be created, and the application will be ready for your selected subject to begin
            testing.
          </p>
        </div>
        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.wizardBackButton}>Back</Button>
          <Button bsStyle={'success'} bsSize={'large'} onClick={this.startTrial}>Start Trial</Button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.props.viewState.tests.get('wizardStage') === wizardStages.SUBJECT_SELECT ? this.renderSubjectSelect()
          : <span></span>}
        {this.props.viewState.tests.get('wizardStage') === wizardStages.IMAGEPASS_SETUP ? this.renderImagePassSetup()
          : <span></span>}
        {this.props.viewState.tests.get('wizardStage') === wizardStages.CONFIRMATION ? this.renderConfirmation()
          : <span></span>}
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(TestSetupView);
