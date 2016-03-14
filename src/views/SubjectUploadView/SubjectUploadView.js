import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { actions as viewActions } from '../../redux/modules/subjectUploadView';
import PassImage from '../../components/PassImage/PassImage';
import ImagePreview from './ImagePreview.js';
import classes from './SubjectUploadView.scss';
import Dropzone from 'react-dropzone';
import Select from 'react-select'

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
    setUploadImages: PropTypes.func.isRequired,
    postImage: PropTypes.func.isRequired,
    newPostImage: PropTypes.func.isRequired,
    discardImage: PropTypes.func.isRequired,
    saveImage: PropTypes.func.isRequired,
    loadPassImages: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.openDropzone = this.openDropzone.bind(this);
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

  onDrop(files) {
    this.props.newPostImage(1, files);
  }

  shouldComponentUpdate(nextProps) {
    return (
      (nextProps.viewState.get('userPassImages') !== this.props.viewState.get('userPassImages')) ||
      (nextProps.viewState.get('uploadImages') !== this.props.viewState.get('uploadImages')) ||
      (nextProps.viewState.get('update') !== this.props.viewState.get('update'))
    );
  }

  componentWillMount() {
    this.props.loadPassImages(1);
  }

  openDropzone() {
    this.refs.dropzone.open();
  }

  renderPassImages (passImageAliases) {
    return passImageAliases.map(image => {
      return <PassImage key={image} img={`http://localhost:7000/image/${image}`}/>
    });
  }

  renderImagePreview(imageMap) {
    const images = imageMap.get(1);
    if (!images || images.length < 1) {
      return (
        <div>
          <div>
            <h4>To add additional images to this collection, </h4>
            <h4>drag them onto this page or click the 'Add New Pictures' button</h4>
          </div>
          <Button bsSize={"large"} bsStyle={"primary"} onClick={this.openDropzone}>Add New Pictures</Button>
        </div>
      );
    } else {
      return (
        <div>
          <h5>These are how the newly uploaded images will appear when testing.</h5>
          <p>
            Images are not added to a collection until they have been confirmed.
          </p>
          <div className={classes.uploadedImages}>
            {
              images.map(image => {
                return <ImagePreview key={image} img={image} saveImage={this.props.saveImage} discardImage={this.props.discardImage}/>
              })
            }
          </div>
        </div>
      );
    }
  }

  render() {
    const options = [
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' }
    ];
    return (
      <Dropzone ref="dropzone"
                className={classes.dropzone}
                activeClassName={classes.dropzoneActive}
                onDrop={this.onDrop}
                disableClick={true}
                accept={"image/jpeg,image/jpg,image/png"}>
        <div className='container text-center'>
          <div>
            <h2>Add New Pass-Images</h2>
          </div>
          <div className={classes.collectionSelect}>
            <h4>Select an image collection: </h4>
            <Select
              options={options}
            />
          </div>
          <div>
            <h4>These are the pass-images currently uploaded:</h4>
            <div className={classes.uploadedImages}>
              {this.renderPassImages(this.props.viewState.get("userPassImages"))}
            </div>
          </div>
          <div className={classes.newPicDiv}>
            {this.renderImagePreview(this.props.viewState.get('uploadImages'))}
          </div>
        </div>
      </Dropzone>
    );
  }
}

export default connect(mapStateToProps, viewActions)(SubjectUploadView);
