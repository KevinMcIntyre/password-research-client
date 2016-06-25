import React from 'react';
import { Button, Input } from 'react-bootstrap';
import { loadCollections } from '../../redux/modules/images.js';
import { store } from '../../main.js';
import classes from '../SubjectView/SubjectView.scss';

export default class ConfigInit extends React.Component {
  constructor() {
    super();
    this.setConfig = this.setConfig.bind(this);
    this.updateTestName = this.updateTestName.bind(this);
  }

  componentDidMount() {
    store.dispatch(loadCollections());
  }

  setConfig() {
    this.props.setConfig(
      this.refs.testName.refs.input.value,
      this.refs.testRows.refs.input.value,
      this.refs.testColumns.refs.input.value,
      this.refs.testStages.refs.input.value
    );
    this.props.incrementWizard();
  }

  updateTestName(e) {
    this.props.updateTestName(e.target.value);
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Configure a New Pass-Image Test</h2>
        </div>
        <div>
          <h4>The pass-image test created here will be made available for use in testing.</h4>
          <h4>Fill out the following information and click 'Next' to continue.</h4>
        </div>
        <br/>

        <div>
          <form className={classes.newUserForm}>
            <div className={classes.formDiv}>
              <Input
                ref='testName'
                type='text'
                label='Test Name'
                placeholder='Enter the name to which you will reference this test.'
                className={classes.textField}
                value={this.props.viewState.get('name')}
                onChange={this.updateTestName}
                bsStyle={this.props.viewState.get('configErrors').indexOf('testName') > -1 ? 'error' : undefined}
                />
              {
                this.props.viewState.get('configErrors').indexOf('testName') > -1
                  ? <p className={classes.errorMsg}>This field is required.</p> : <span></span>
              }
              <div className={classes.matrixSelect}>
                <Input type='select' label='Rows' ref='testRows'
                       standalone={true} defaultValue={this.props.viewState.get('rows')}>
                  {[1, 2, 3, 4, 5].map((number) => {
                    return <option key={number} value={number.toString()}>{number}</option>;
                  })}
                </Input>
                <span className={classes.matrixTimes}>
                  x
                </span>
                <Input type='select' label='Columns' ref='testColumns'
                       standalone={true} defaultValue={this.props.viewState.get('columns')}>
                  {[1, 2, 3, 4, 5].map((number) => {
                    return <option key={number} value={number.toString()}>{number}</option>;
                  })}
                </Input>
              </div>
              <div className={classes.stageSelect}>
                <Input type='select' label='Stages' ref='testStages' defaultValue={this.props.viewState.get('stages')}>
                  {[1, 2, 3, 4, 5, 6].map((number) => {
                    return <option key={number} value={number.toString()}>{number}</option>;
                  })}
                </Input>
              </div>
              <div className={classes.radioContainer}>
                <label className='control-label'>
                  <span>
                    Show 'None of my pass-images are displayed here' button
                  </span>
                </label>
                <Input ref='notPresentTrue' className={classes.radioButton} name='test' type='radio' standAlone={true}
                       label='True' value='true' checked={this.props.viewState.get('mayNotHaveSubjectImage')}
                       onChange={this.props.toggleMayNotHaveImage.bind(null, true)}
                  />
                <Input ref='notPresentFalse' className={classes.radioButton} name='test' type='radio' standAlone={true}
                       label='False' value='false' checked={!this.props.viewState.get('mayNotHaveSubjectImage')}
                       onChange={this.props.toggleMayNotHaveImage.bind(null, false)}
                  />
              </div>
              <div className={classes.formButtons}>
                <Button onClick={this.setConfig} bsStyle={'primary'}>Next</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
