import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { actions as viewActions } from '../../redux/modules/subjectUploadView';
import PassImage from '../../components/PassImage/PassImage';
import classes from './SubjectUploadView.scss';
// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  viewState: state.subjectUploadView
});
export class SubjectUploadView extends React.Component {
  static propTypes = {
    viewState: PropTypes.object.isRequired,
    toggleAddPicModal: PropTypes.func.isRequired,
    setUploadImageSrc: PropTypes.func.isRequired,
    postImage: PropTypes.func.isRequired,
    cancelImage: PropTypes.func.isRequired,
    saveImage: PropTypes.func.isRequired,
    loadPassImages: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.cancelImage = this.cancelImage.bind(this);
    this.saveImage = this.saveImage.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleImage(e) {
    var self = this;
    var reader = new FileReader();
    var file = e.target.files[0];

    reader.onload = function(upload) {
      self.props.postImage(1, upload.target.result);
    };

    reader.readAsDataURL(file);
  }

  cancelImage() {
    this.props.cancelImage(1, this.props.viewState.get('uploadImageSrc'))
  }

  saveImage() {
    this.props.saveImage(1, this.props.viewState.get('uploadImageSrc'))
    this.props.cancelImage(1, this.props.viewState.get('uploadImageSrc'))
  }

  shouldComponentUpdate(nextProps) {
    return ((nextProps.viewState.get('userPassImages') !== this.props.viewState.get('userPassImages')) ||(nextProps.viewState.get('uploadImageSrc') !== this.props.viewState.get('uploadImageSrc'))) || (nextProps.viewState.get('showAddPicModal') !== this.props.viewState.get('showAddPicModal'));
  }

  componentWillMount() {
    this.props.loadPassImages(1);
  }

  renderPassImages (passImageAliases) {
    return passImageAliases.map(image => {
      return <PassImage key={image} img={(`http://localhost:7000/image/${image}`)}/>
    });
  }

  render() {
    let modalBody;
    let modalFooter;
    if (!this.props.viewState.get('uploadImageSrc')) {
      modalBody = (
        <div>
          <h4 className={classes.centeredModalTitle}>Select a picture from your computer.</h4>
          <br/>
          <div className={classes.centeredDiv}>
            <form onSubmit={this.handleSubmit} encType='multipart/form-data'>
              <input type='file' onChange={this.handleImage}/>
            </form>
          </div>
        </div>
      );
      modalFooter = (
        <div className={classes.centeredModalButtonGroup}>
          <Button onClick={this.props.toggleAddPicModal}>Close</Button>
        </div>
      );
    } else {
      modalBody = (
        <div>
          <div className={classes.outerPictureBody}>
            <div className={classes.pictureBody}>
              <h5>Image preview:</h5>
              <PassImage key={'prev'} img={('http://localhost:7000/upload/preview/' + this.props.viewState.get('uploadImageSrc'))}/>
            </div>
          </div>
        </div>
      );
      modalFooter = (
        <div className={classes.centeredModalButtonGroup}>
          <Button bsStyle="danger" onClick={this.cancelImage}>Discard</Button>
          <Button bsStyle="success" onClick={this.saveImage}>Save</Button>
        </div>
      );
    }
    return (
      <div className='container text-center'>
        <div>
          <h3>Hello Johnny!</h3>
        </div>
        <div>
          <h1>These are your currently uploaded pass-images:</h1>
          <div className={classes.uploadedImages}>
            {this.renderPassImages(this.props.viewState.get("userPassImages"))}
          </div>
        </div>
        <div className={classes.newPicDiv}>
          <Button bsSize={"large"} bsStyle={"primary"} onClick={this.props.toggleAddPicModal}>Add New Pictures</Button>
        </div>
        <Modal bsSize={"small"} show={this.props.viewState.get('showAddPicModal')}>
          <Modal.Header>
            <Modal.Title className={classes.centeredModalTitle}>Add a New Picture</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalBody}
          </Modal.Body>
          <Modal.Footer className={classes.uploadModalFooter}>
            {modalFooter}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectUploadView);
