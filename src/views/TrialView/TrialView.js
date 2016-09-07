import React from 'react';
import IntroView from './IntroView';
import OutroView from './OutroView';
import ImageAuthView from './ImageAuthView';
import { wizardStages } from '../../redux/modules/trials.js';
import { connect } from 'react-redux';
import { actions as viewActions} from '../../redux/modules/trials';

const mapStateToProps = (state) => ({
  viewState: state.trials,
  appState: state.app
});

export class TrialView extends React.Component {
    componentWillMount() {
      if (!this.props.appState.get('isTesting')) {
        this.props.redirectToTestSetup();
      }
    }
    componentWillUnmount() {
        this.props.endTrial();
    }
    render() {
        let currentView;

        switch(this.props.viewState.get('wizardStage')) {
          case wizardStages.AUTHENTICATION: {
            currentView = <ImageAuthView />;
            break;
          }
          case wizardStages.OUTRO: {
            currentView = <OutroView subjectName={this.props.viewState.get('subjectName')} />;
            break;
          }
          default: {
            currentView =
              <IntroView subjectName={this.props.viewState.get('subjectName')}
                       imageMayNotBePresent={this.props.viewState.get('imageMayNotBePresent')}
                       stages={this.props.viewState.get('stages')}
                       beginTrial={this.props.beginTrial}
              />;
            break;
          }
        }

        return currentView;
    }
}

export default connect(mapStateToProps, viewActions)(TrialView);
