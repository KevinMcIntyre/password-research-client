import React from 'react';
import { Button, Input } from 'react-bootstrap';
import { actions as appActions } from '../../redux/modules/app.js';
import { store } from '../../main.js';
import ChangeImageModal from './ChangeImageModal.js';
import classes from '../SubjectView/SubjectView.scss';
import configClasses from './ConfigView.scss';
import ImageMatrix from '../../components/ImageMatrix/ImageMatrix.js';

export default class ConfigStages extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    if (!this.props.viewState.get('createdStages')) {
      store.dispatch(appActions.setLoadingState(true, 'Generating test stages...'));
      const stages = this.props.viewState.get('stages');
      const rows = this.props.viewState.get('rows');
      const columns = this.props.viewState.get('columns');
      this.props.generateConfigStages(stages, rows, columns);
    }
  }

  render() {
    return (
      <div className='container text-center'>
        <div>
          <h2>Configure Pass-Image Test</h2>
        </div>
        <div>
          <h3>These stages will be used when a test is run with this configuration.</h3>

          <p>
            These stages were generated randomly and include no subject pass-images.<br/>
            To replace an image in the stage, click on it for options.<br/>
          </p>
          {this.props.viewState.get('assignUserImgError') ? 
            <p className={configClasses.passImgErrorMsg}>A users pass-image must be assigned within the matrix.</p> : ''
          }
        </div>
        <div>
          <ImageMatrix rows={parseInt(this.props.viewState.get('rows'), 10)}
                       columns={parseInt(this.props.viewState.get('columns'), 10)}
                       noneEnabled={this.props.viewState.get('mayNotHaveSubjectImage')}
                       matrix={this.props.viewState.get('createdStages') != undefined ? this.props.viewState.get('createdStages').get(this.props.viewState.get('currentStageBeingSet').toString()) : undefined}
                       currentStage={this.props.viewState.get('currentStageBeingSet')}
                       totalStages={this.props.viewState.get('stages')}
                       onImageClick={this.props.toggleChangeImageModal}
                       random={true}
            />
        </div>
        
        <div className={classes.buttonGroup}>
          <Button className={classes.backButton} bsSize={'large'} onClick={this.props.decrementWizard}>Back</Button>
          <Button bsSize={'large'} onClick={this.props.incrementWizard}>Next</Button>
        </div>
        <ChangeImageModal show={this.props.viewState.get('showChangeImageModal')}
                          toggleModal={this.props.toggleChangeImageModal}
                          selectedAlias={this.props.viewState.get('selectedAlias')}
                          replacementType={this.props.viewState.get('replacementType')}
                          replacementAlias={this.props.viewState.get('replacementAlias')}
                          configId={this.props.viewState.get('configId')}
                          changeReplacementType={this.props.changeReplacementType}
                          randomAlias={this.props.viewState.get('randomAlias')}
                          getRandomImage={this.props.getRandomImage}
                          setReplacementAlias={this.props.setReplacementAlias}
                          confirmImageReplacement={this.props.confirmImageReplacement}
                          collections={this.props.collectionState.get('collections')}
                          collection={this.props.collectionState.get('currentCollection')}
                          collectionImages={this.props.collectionState.get('collectionImages')}


        />
      </div>
    );
  }
}
