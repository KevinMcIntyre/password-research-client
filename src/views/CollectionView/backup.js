import React, { PropTypes } from 'react';
import { store } from '../../main';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { actions as appActions } from '../../redux/modules/app';
import { actions as imageActions } from '../../redux/modules/images';
import PassImage from '../../components/PassImage/PassImage';
import ImagePreview from './ImagePreview.js';
import classes from './CollectionView.scss';
import { LinkContainer } from 'react-router-bootstrap';
import Dropzone from 'react-dropzone';
import Select from 'react-select'

const mapStateToProps = (state) => ({
  viewState: state.images.get('collections')
});
export class CollectionSelectView extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.openDropzone = this.openDropzone.bind(this);
    this.renderCollection = this.renderCollection.bind(this);
    this.selectCollection = this.selectCollection.bind(this);
  }

  selectCollection(selection) {
    if (!selection) {
      this.props.setCollection(undefined);
    } else {
      store.dispatch(appActions.setLoadingState(true, "Loading collection"));
      this.props.setCollection({
        id: selection.value,
        label: selection.label
      });
      this.props.loadImages(undefined, selection.value);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  onDrop(files) {
    store.dispatch(appActions.setLoadingState(true, "Processing images"));
    this.props.postImage(undefined, this.props.viewState.get('currentCollection').id, files);
  }

  shouldComponentUpdate(nextProps) {
    // FIX THIS
    return nextProps != undefined;
  }

  componentWillMount() {
    if(this.props.viewState.get('collections').length == 0) {
      store.dispatch(appActions.setLoadingState(true, "Getting collections"));
    }
  }

  componentDidMount() {
    if(this.props.viewState.get('collections').length == 0) {
      this.props.loadCollections();
    }
  }

  openDropzone() {
    this.refs.dropzone.open();
  }

  renderCollection () {
    return (
      <div>
        <div>
          <h4>These are the pass-images currently uploaded:</h4>
          <div className={classes.uploadedImages}>
            {this.renderPassImages(this.props.viewState.get("collectionImages"))}
          </div>
        </div>
        <div className={classes.newPicDiv}>
          {this.renderImagePreview(this.props.viewState.get('uploadImages'))}
        </div>
      </div>
    );
  }

  renderPassImages (passImageAliases) {
    return passImageAliases.map(image => {
      return <PassImage key={image} img={`http://localhost:7000/image/${image}`}/>
    });
  }

  renderImagePreview(images) {
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
                return <ImagePreview key={image}
                                     img={image}
                                     saveImage={this.props.saveImage}
                                     discardImage={this.props.discardImage}
                                     subjectId={0}
                                     collectionId={this.props.viewState.get('currentCollection').id}
                  />
              })
            }
          </div>
        </div>
      );
    }
  }

  render() {
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
              value={this.props.viewState.get('currentCollection')}
              options={this.props.viewState.get('collections')}
              onChange={this.selectCollection}
              />
          </div>
          {
            this.props.viewState.get('currentCollection') ? this.renderCollection() :
              <div>
                <h4>To create a new image collection, click the 'New Collection' button below.</h4>
                <LinkContainer to={{pathname: '/collections/new'}}>
                  <Button bsSize={"large"} bsStyle={"primary"}>New Collection</Button>
                </LinkContainer>
              </div>
          }
        </div>
      </Dropzone>
    );
  }
}

export default connect(mapStateToProps, imageActions)(CollectionSelectView);
