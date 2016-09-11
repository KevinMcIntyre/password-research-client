import React from 'react';
import { Button, Modal, Input } from 'react-bootstrap';
import Icon from 'react-fa';
import { store } from '../../main.js';
import Select from 'react-select';
import PassImage from '../../components/PassImage/PassImage.js';
import Spinner from 'react-spinkit';
import classes from '../SubjectView/SubjectView.scss';
import { setCollection, loadImages } from '../../redux/modules/images.js';
import { resetCollectionSelection } from '../../redux/modules/images.js';

export default class ChangeImageModal extends React.Component {
  constructor() {
    super();
    this.selectCollection = this.selectCollection.bind(this);
    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    this.props.confirmImageReplacement(this.props.configId, this.props.selectedAlias, this.props.selectedStage, this.props.selectedRow, this.props.selectedColumn, this.props.replacementAlias, this.props.replacementType, this.props.collection ? this.props.collection.id : undefined);
    store.dispatch(resetCollectionSelection());
  }

  cancel() {
    this.props.toggleModal();
    store.dispatch(resetCollectionSelection());
  }

  setReplacementType(replacementType) {
    this.props.changeReplacementType(replacementType, this.props.configId, this.props.selectedAlias);
  }

  shouldComponentUpdate(nextProps) {
    // FIX THIS
    return nextProps !== undefined;
  }

  selectCollection(selection) {
    store.dispatch(setCollection({
      id: selection.value,
      label: selection.label
    }));
    store.dispatch(loadImages(undefined, selection.value));
  }

  render() {
    let modalBody;
    if (this.props.replacementAlias) {
      let replacementImageHref;
      if (this.props.replacementType === 'collection-img') {
        replacementImageHref = `http://localhost:7000/image/${this.props.replacementAlias}`;
      } else if (this.props.replacementType === 'random-img') {
        replacementImageHref = `http://localhost:7000/random/image/${this.props.replacementAlias}`;
      } else {
        replacementImageHref = 'http://localhost:7000/assets/img/participant-image.jpeg';
      }
      modalBody = (
        <div>
          <h3>Please confirm the following image replacement:</h3>

          <div className={classes.beforeAfterDiv}>
            <h4>Before</h4>
            <PassImage img={`http://localhost:7000//random/image/${this.props.selectedAlias}`}
                       alias={this.props.selectedAlias} isTesting={false}/>
          </div>
          <Icon name='long-arrow-right' size='3x' className={classes.beforeAfterIcon}/>

          <div className={classes.beforeAfterDiv}>
            <h4>After</h4>
            <PassImage img={replacementImageHref} alias={this.props.replacementAlias} isTesting={false}/>
          </div>
        </div>
      );
    } else if (this.props.replacementType) {
      switch (this.props.replacementType) {
        case 'collection-img':
        {
          if (!this.props.collection) {
            modalBody = (
              <div>
                <div>
                  <h3>Select an image collection</h3>
                </div>
                <div className={classes.collectionSelect}>
                  <p>Select an image collection using the dropdown below: </p>
                  <Select
                    options={this.props.collections}
                    onChange={this.selectCollection}
                    />
                </div>
              </div>
            );
          } else if (this.props.collectionImages.length == 0) {
            modalBody = (
              <div>
                <div className={classes.loadingDiv}>
                  <h3>Fetching collection images...</h3>
                  <div className='spinnerDiv'>
                    <Spinner spinnerName='three-bounce' noFadeIn={true}/>
                  </div>
                </div>
              </div>
            );
          } else {
            let images = [];
            let i = 1;
            this.props.collectionImages.map((image) => {
              images.push(<PassImage key={i} img={`http://localhost:7000/image/${image}`}
                         alias={image} isTesting={true} onImageClick={this.props.setReplacementAlias} />);
              if (i % 5 === 0) {
                images.push(<br key={i.toString() + 'ok'}/>);
              }
              i++;
            });
            modalBody = (
              <div>
                <h3>Select the replacement image</h3>
                {images}
              </div>
            );
          }

          break;
        }
        case 'random-img':
        {
          if (this.props.randomAlias) {
            modalBody = (
              <div>
                <h3>How about this image?</h3>
                <PassImage img={`http://localhost:7000//random/image/${this.props.randomAlias}`}
                           alias={this.props.selectedAlias} isTesting={false}/>
                <div className={classes.buttonGroup}>
                  <Button className={classes.backButton} bsStyle='success' onClick={this.props.setReplacementAlias.bind(null, this.props.randomAlias)}>Looks good!</Button>
                  <Button bsStyle='warning' onClick={this.props.getRandomImage.bind(null, this.props.configId, this.props.selectedAlias)}>No, try again.</Button>
                </div>
              </div>
            );
          } else {
            modalBody = (
              <div className={classes.loadingDiv}>
                <h3>Fetching a random image...</h3>
                <div className='spinnerDiv'>
                  <Spinner spinnerName='three-bounce' noFadeIn={true}/>
                </div>
              </div>
            );
          }
          break;
        }
        default:
        {
          throw "Somehow, an invalid way to replace an image was selected.";
        }
      }
    } else {
      modalBody = (
        <div>
          <div>
            <h3>To replace this image,</h3>
            <PassImage img={`http://localhost:7000//random/image/${this.props.selectedAlias}`}
                       alias={this.props.selectedAlias} isTesting={false}/>

            <h3>Select one of the following options:</h3>
          </div>
          <div>
            <div className={classes.radioContainer}>
              <Input ref='collection-img' className={classes.radioButton} name='replace-img' type='radio'
                     standAlone={true}
                     label='Select from an image collection' value='collection-img'
                     checked={this.props.replacementType === 'collection-img'}
                     onChange={this.setReplacementType.bind(this, 'collection-img')}
                />
              <Input ref='user-img' className={classes.radioButton} name='replace-img' type='radio' standAlone={true}
                     label="Assign a user's pass-image at test setup" value='user-img'
                     checked={this.props.replacementType === 'user-img'}
                     onChange={this.setReplacementType.bind(this, 'user-img')}

                />
              <Input ref='random-img' className={classes.radioButton} name='replace-img' type='radio' standAlone={true}
                     label='New random image' value='random-img'
                     checked={this.props.replacementType === 'random-img'}
                     onChange={this.setReplacementType.bind(this, 'random-img')}
                />
            </div>
          </div>
        </div>
      );
    }
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>
            Replace An Image
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={"text-center"}>
            {modalBody}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {this.props.replacementAlias ?
            <Button className={classes.backButton} bsStyle='success' onClick={this.confirm}>Confirm</Button> :
            <span></span>
          }
          <Button onClick={this.cancel}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
