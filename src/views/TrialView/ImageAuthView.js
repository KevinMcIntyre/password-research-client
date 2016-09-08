import React from 'react';
import ImageMatrix from '../../components/ImageMatrix/ImageMatrix';
import classes from './TrialView.scss';

export default class ImageAuthView extends React.Component {
  render() {
    return (
      <div className='container text-center'>
        <div className={classes.authContainer}>
          <h1>You are now attempting to authenticate successfully, {this.props.subjectName}!</h1>
          <h4>Please click on your pass-image to continue authentication.</h4>
          <ImageMatrix rows={this.props.rows}
                       columns={this.props.columns}
                       noneEnabled={this.props.imageMayNotBePresent}
                       matrix={this.props.matrix}
                       currentStage={this.props.currentStage}
                       totalStages={this.props.stages}
                       onImageClick={this.props.selectImage}
                       onButtonClick={this.props.selectImage.bind(null, 'no-pass-image')}
                       random={false}
            />
        </div>
      </div>
    );
  }
}
