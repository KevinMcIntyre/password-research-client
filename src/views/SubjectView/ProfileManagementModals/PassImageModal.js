import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import classes from '../SubjectView.scss';
import PassImage from '../../../components/PassImage/PassImage.js';
import { actions as imageActions } from '../../../redux/modules/images';
import Dropzone from 'react-dropzone';
import Spinner from 'react-spinkit';
import ImagePreview from '../../CollectionView/ImagePreview.js';

const mapStateToProps = (state) => ({
  viewState: state.images.get('subject')
});

export class PassImageModal extends React.Component {
  constructor() {
    super();
    this.onDrop = this.onDrop.bind(this);
    this.openDropzone = this.openDropzone.bind(this);
    this.renderPassImages = this.renderPassImages.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    // FIX THIS
    return nextProps !== undefined;
  }

  onDrop(files) {
    this.props.setSubjectLoadingState(true);
    this.props.postImage(this.props.subjectId, 0, files);
  }

  openDropzone() {
    this.refs.dropzone.open();
  }

  renderPassImages(passImageAliases) {
    return passImageAliases.map(image => {
      return <PassImage key={image} img={`http://localhost:7000/image/${image}`}/>;
    });
  }

  render() {
    let images;
    if (this.props.viewState.get('subjectImages').length > 0) {
      images = (
        <div>
          <h4>These are the pass-images currently uploaded:</h4>

          <div>
            {this.renderPassImages(this.props.viewState.get('subjectImages'))}
          </div>
        </div>
      );
    } else {
      images = (
        <div>
          <h4>This subject does not have any pass images!</h4>
          <br/>
        </div>
      );
    }
    const loading = (
      <div className='loadingContainer'>
        <div className={classes.loadingDiv}>
          <br/>
          <br/>

          <h2>{"Processing images..."}</h2>

          <div className='spinnerDiv'>
            <Spinner spinnerName='three-bounce' noFadeIn={true}/>
          </div>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
      </div>
    );

    let uploadPreview;

    if (this.props.viewState.get('uploadImages').length > 0) {
      uploadPreview = (
        <div>
          <h5>These are how the newly uploaded images will appear when testing.</h5>
          <p>
            Images are not added to a collection until they have been confirmed.
          </p>
          <div>
            {
              this.props.viewState.get('uploadImages').map(image => {
                return <ImagePreview key={image}
                                     img={image}
                                     saveImage={this.props.saveImage}
                                     discardImage={this.props.discardImage}
                                     subjectId={this.props.subjectId}
                                     collectionId={0}
                  />;
              })
            }
          </div>
        </div>
      );
    } else {
      uploadPreview = (
        <div>
          <h4>To add images for this subject, drag them into this box</h4>
          <h4>or click the 'Add New Pictures' button</h4>
          <br/>
          <Button bsStyle={'primary'} className={classes.saveButton} onClick={this.openDropzone}>Add New
            Pictures</Button>
          <Button onClick={this.props.toggleModal}>Close</Button>
          <br/>
        </div>
      );
    }
    return (
      <Modal show={this.props.show}>
        <Dropzone ref='dropzone'
                  className={classes.dropzone}
                  activeClassName={classes.dropzoneActive}
                  onDrop={this.onDrop}
                  disableClick={true}
                  accept={'image/jpeg,image/jpg,image/png'}>
          <Modal.Header>
            <Modal.Title id='contained-modal-title-lg'>
              {this.props.subjectName}'s Pass Images
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.props.viewState.get('loading') ? loading
              : <div className='text-center'>
              <div>
                <br/>
                {images}
              </div>
              {uploadPreview}
              <br/>
              <br/>
            </div>
            }
          </Modal.Body>
        </Dropzone>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, imageActions)(PassImageModal);

