import React from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import { actions as viewActions, wizardStages } from '../../redux/modules/config';
import ConfigInit from './ConfigInit.js';
import ConfigStages from './ConfigStages.js';
import ConfirmConfig from './ConfirmConfig.js';
import classes from '../SubjectView/SubjectView.scss';

// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  viewState: state.config
});

export class ConfigView extends React.Component {
  constructor() {
    super();
  }

  componentWillUnmount() {
    this.props.clearForm();
  }

  render() {
    return (
      <div>
        {
          this.props.viewState.get('wizardStage') == wizardStages.CONFIG_INIT
            ? <ConfigInit viewState={this.props.viewState} setConfig={this.props.setConfig}
                          updateTestName={this.props.updateTestName}
                          setSubjectImagePresent={this.props.toggleMayNotHaveImage}
                          incrementWizard={this.props.incrementWizard}/> : <span></span>
        }
        {
          this.props.viewState.get('wizardStage') == wizardStages.STAGE_SETUP
            ? <ConfigStages viewState={this.props.viewState}
                            generateConfigStages={this.props.generateConfigStages}
                            incrementWizard={this.props.incrementWizard}
                            decrementWizard={this.props.decrementWizard}
            /> : <span></span>
        }
        {
          this.props.viewState.get('wizardStage') == wizardStages.CONFIRMATION
            ? <ConfirmConfig viewState={this.props.viewState}
                             decrementWizard={this.props.decrementWizard}
            /> : <span></span>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(ConfigView);
