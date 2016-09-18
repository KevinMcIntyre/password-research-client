import React from 'react';
import IntroView from './IntroView';
import OutroView from './OutroView';
import ImageAuthView from './ImageAuthView';
import PasswordAuthView from './PasswordAuthView';
import PinAuthView from './PinAuthView';
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
        this.props.stopTrial(this.props.viewState.get('trialId'));
    }
    render() {
        let currentView;

        switch(this.props.viewState.get('wizardStage')) {
          case wizardStages.AUTHENTICATION: {
            switch (this.props.viewState.get('trialType')) {
              case 'Pass-Image': {
                currentView =
                  <ImageAuthView subjectName={this.props.viewState.get('subjectName')}
                                 rows={this.props.viewState.get('rows')}
                                 columns={this.props.viewState.get('columns')}
                                 imageMayNotBePresent={this.props.viewState.get('imageMayNotBePresent')}
                                 matrix={this.props.viewState.get('matrix')}
                                 currentStage={this.props.viewState.get('authStage')}
                                 stages={this.props.viewState.get('stages')}
                                 selectImage={(imageId) => {
                                   this.props.selectPassImage(
                                     this.props.viewState.get('trialId'),
                                     this.props.viewState.get('authStage'),
                                     imageId
                                  );
                                 }}

                    />;
                break;
              }
              case 'Password': {
                currentView =
                  <PasswordAuthView subjectName={this.props.viewState.get('subjectName')} />;
                break;
              }
              case 'Pin': {
                currentView =
                  <PinAuthView subjectName={this.props.viewState.get('subjectName')}
                               trialId={this.props.viewState.get('trialId')}
                               submitPinNumber={this.props.submitPassword}
                               blank={this.props.viewState.get('showBlankPasswordMessage')}
                               incorrect={this.props.viewState.get('showIncorrectPasswordMessage')}
                               attemptsLeft={this.props.viewState.get('attemptsAllowed') - this.props.viewState.get('attemptsTaken')}
                  />;
                break;
              }
              default: {
                throw new Error('The set trial type is invalid.')
              }
            }
            break;
          }
          case wizardStages.OUTRO: {
            currentView =
              <OutroView subjectName={this.props.viewState.get('subjectName')}
                         successfulAuth={this.props.viewState.get('successfulAuth')}
                         exit={()=>{
                          this.props.redirectToTestSetup();
                          this.props.stopTrial(this.props.viewState.get('trialId'));
                         }}
              />;
            break;
          }
          default: {
            currentView =
              <IntroView  trialType={this.props.viewState.get('trialType')}
                          subjectName={this.props.viewState.get('subjectName')}
                          imageMayNotBePresent={this.props.viewState.get('imageMayNotBePresent')}
                          stages={this.props.viewState.get('stages')}
                          beginTrial={this.props.setStartTimeAndBegin.bind(null, this.props.viewState.get('trialId'), this.props.viewState.get('trialType'))}
              />;
            break;
          }
        }

        return currentView;
    }
}

export default connect(mapStateToProps, viewActions)(TrialView);
