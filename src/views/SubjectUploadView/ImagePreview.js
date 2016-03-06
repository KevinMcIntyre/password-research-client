import React, { PropTypes } from 'react';
import PassImage from '../../components/PassImage/PassImage';
import classes from './SubjectUploadView.scss';
import Icon from 'react-fa';

export default class ImagePreview extends React.Component {
  constructor() {
    super();
    this.saveImage = this.saveImage.bind(this);
    this.discardImage = this.discardImage.bind(this);
  }

  saveImage() {
    this.props.saveImage(1, this.props.img);
    this.props.discardImage(1, this.props.img);
  }

  discardImage() {
    this.props.discardImage(1, this.props.img);
  }

  render() {
    return(
      <span className={classes.imagePreview}>
        <PassImage img={`http://localhost:7000/upload/preview/${this.props.img}`} />
        <div className={classes.previewButtons}>
          <Icon name='times' className={classes.closeButton} onClick={this.discardImage} />
          <Icon name='check' className={classes.saveButton} onClick={this.saveImage} />
        </div>
      </span>
    );
  }
}
