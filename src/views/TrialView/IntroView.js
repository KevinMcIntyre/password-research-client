import React from 'react';
import classes from './TrialView.scss';
import { Button } from 'react-bootstrap';

export default class IntroView extends React.Component {
  render() {
    let intro;
    if (this.props.trialType === 'Pass-Image') {
      intro = (
      <div>
        <p>You are about to attempt to authenticate through an image-based password system.</p>
        <p>There will be {this.props.stages} {(this.props.stages > 1) ? 'stages' : 'stage'} of authentication.</p>
        <p>{(this.props.stages > 1) ? 'At each stage, you ' : 'You '} will be presented with a matrix of images similar to the one below: </p>

        {this.props.imageMayNotBePresent ?
          <div>
            <div className={classes.matrixImg}>
              <img></img>
            </div>
            <p>One of these images may, or may not be yours. Please note that it is possible that none of the images within the matrix are yours. If you do not recognize any images as your own, click the blue "None of my pass-images are displayed here" button. Otherwise, click on the image that you recognize as your own. </p>
          </div>
          :
          <div>
            <div className={classes.matrixImg}>
              <img></img>
            </div>
            <p>One of the images in the matrix is your pass-image. When presented with the matrix, please select the image you believe is your own.</p>
          </div>
        }
      </div>
      )
    } else if (this.props.trialType === 'Password') {
      intro = (
        <div>
          <p>You are about to attempt to authenticate using the password that you set-up previously.</p>
          <p>When you begin authentication, you will be presented with an input field to enter your password.</p>
        </div>
      )
    } else {
      intro = (
        <div>
          <p>You are about to attempt to authenticate using the pin number you set-up previously.</p>
          <p>When you begin authentication, you will be presented with an on-screen keypad.</p>
          <p>You may enter your pin number using the on-screen keypad, or by typing it into the field within the keypad.</p>
        </div>
      )
    }

    return (
      <div className='container text-center'>
        <div className={classes.intro}>
          <h1>Hello, {this.props.subjectName}.</h1>
          { intro }
          <p>If you have any questions, please ask your instructor now.</p>
          <p>To begin the authentication process, please press the 'Begin' button.</p>
          <div>
            <Button bsStyle='success' bsSize='large' onClick={this.props.beginTrial}>Begin</Button>
          </div>
        </div>
      </div>
    );
  }
}
