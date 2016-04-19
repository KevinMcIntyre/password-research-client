import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import { store } from '../../main';
import { actions as appActions } from '../../redux/modules/app';
import { actions as viewActions, wizardStages } from '../../redux/modules/tests';
import { actions as subjectActions } from '../../redux/modules/subjects';
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
    this.setImageTestType = this.setImageTestType.bind(this);
    this.renderSubjectSelect = this.renderSubjectSelect.bind(this);
    this.renderImagePassSetup = this.renderImagePassSetup.bind(this);
    this.renderConfirmation = this.renderConfirmation.bind(this);
    this.wizardNextButton = this.wizardNextButton.bind(this);
    this.wizardBackButton = this.wizardBackButton.bind(this);
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
  }

  componentDidMount() {
    if (this.props.viewState.subjects.get('subjectList').length === 0) {
      store.dispatch(subjectActions.loadSubjects());
    }
  }

  componentWillUnmount() {
    this.props.resetTestSetup();
  }

  setSubject(subject) {
    if (subject) {
      this.props.setSubject(subject.value);
    } else {
      this.props.setSubject(undefined);
    }
  }

  setTest(testType) {
    this.props.setTest(testType);
  }

  setImageTestType(testType) {
    console.log(testType);
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
            value={this.props.viewState.tests.get('subject')}
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
    return (
      <div className='container text-center'>
        <h3>Pass-Image Test Setup</h3>
        <br/>
        <h4>Select an option set from the dropdown below.</h4>
        <h4>Option sets can be created in the 'Administration' section under 'Preferences'</h4>
        <br/>

        <div className={classes.subjectSelect}>
          <Select
            value={this.props.viewState.tests.get('imageTestOption')}
            options={this.props.viewState.tests.get('imageTestOptionList')}
            onChange={this.setImageTestType}
            clearable={false}
            />
        </div>
        <div className={classes.imageSettingContainer}>
          <div className={classes.imageTestSettings}>
            <div className={classes.imageTestSettingHeader}>
              <h3><span className={classes.optionKey}>Option Set:</span> Default</h3>
            </div>
            <div className={classes.imageTestSettingsTableContainer}>
              <table>
                <tbody>
                <tr>
                  <td className={classes.optionKey}>
                    Matrix size:
                  </td>
                  <td>
                    4 x 4
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Number of stages:
                  </td>
                  <td>
                    6
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Image May Not Be Present:
                  </td>
                  <td>
                    True
                  </td>
                </tr>
                <tr>
                  <td className={[classes.stagesKey]}>
                    Stages:
                  </td>
                  <td>
                    <table>
                      <tbody>
                      <tr>
                        <td>
                          Stage 1:
                        </td>
                        <td>
                          Random
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Stage 2:
                        </td>
                        <td>
                          Random
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Stage 3:
                        </td>
                        <td>
                          Custom stage
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Stage 4:
                        </td>
                        <td>
                          Collection - 'Flowers'
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Stage 5:
                        </td>
                        <td>
                          Custom stage
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Stage 6:
                        </td>
                        <td>
                          Random
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <br/>

        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.wizardBackButton}>Back</Button>
          <Button bsSize={'large'} onClick={this.wizardNextButton}>Next</Button>
        </div>
      </div>
    );
  }

  renderConfirmation() {
    return (
      <div className='container text-center'>
        <h3>Confirm Trial Settings</h3>

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
                    {this.props.viewState.subjects.get('subjectMap').get(this.props.viewState.tests.get('subject'))}
                  </td>
                </tr>
                <tr>
                  <td className={classes.optionKey}>
                    Authentication Type:
                  </td>
                  <td>
                    {this.props.viewState.tests.get('testType') === 'image' ? 'Pass-Image' : ''}
                    {this.props.viewState.tests.get('testType') === 'password' ? 'Password' : ''}
                    {this.props.viewState.tests.get('testType') === 'pin' ? 'Pin Number' : ''}
                  </td>
                </tr>
                {this.props.viewState.tests.get('testType') === 'image' ? (<div>
                  <tr>
                    <td className={classes.optionKey}>
                      Matrix size:
                    </td>
                    <td>
                      4 x 4
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.optionKey}>
                      Number of stages:
                    </td>
                    <td>
                      6
                    </td>
                  </tr>
                  <tr>
                    <td className={classes.optionKey}>
                      Image May Not Be Present:
                    </td>
                    <td>
                      True
                    </td>
                  </tr>
                  <tr>
                    <td className={[classes.stagesKey]}>
                      Stages:
                    </td>
                    <td>
                      <table>
                        <tbody>
                        <tr>
                          <td>
                            Stage 1:
                          </td>
                          <td>
                            Random
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Stage 2:
                          </td>
                          <td>
                            Random
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Stage 3:
                          </td>
                          <td>
                            Custom stage
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Stage 4:
                          </td>
                          <td>
                            Collection - 'Flowers'
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Stage 5:
                          </td>
                          <td>
                            Custom stage
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Stage 6:
                          </td>
                          <td>
                            Random
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </div>) : (<span></span>) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
          <Button bsStyle={'success'} bsSize={'large'} onClick={this.wizardNextButton}>Start Trial</Button>
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
