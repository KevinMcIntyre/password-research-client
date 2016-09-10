import React from 'react';
import { Button } from 'react-bootstrap';
import PassImage from '../PassImage/PassImage.js';
import classes from './ImageMatrix.scss';

export default class ImageMatrix extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.matrix) {
      return ((this.props.matrix != nextProps.matrix || this.props.matrix.get("1").get("1") !== nextProps.matrix.get("1").get("1")) || (this.props.currentStage !== nextProps.currentStage));
    } else {
      return true;
    }
  }

  render() {
    let matrix = [];
    if (this.props.matrix != undefined) {
      for (var i = 1; i <= this.props.rows; i++) {
        let imageRow = [];
        for (let j = 1; j <= this.props.columns; j++) {
          let img = this.props.matrix.get(i.toString()).get(j.toString());
          if (img === 'user-img') {
            imageRow.push(<PassImage key={i.toString() + j.toString()}
                                     img={`http://localhost:7000/assets/img/participant-image.jpeg`} alias={'user-img'}
                                     isTesting={true} onImageClick={this.props.onImageClick.bind(null, 'user-img', i, j)}/>);
          } else if (this.props.random) {
            imageRow.push(<PassImage key={img} img={`http://localhost:7000/random/image/${img}`} alias={img}
                                     isTesting={true} onImageClick={this.props.onImageClick}/>);
          } else if (this.props.testing) {
            imageRow.push(<PassImage key={img} img={`http://localhost:7000/test/image/${img}`} alias={img}
                                     isTesting={true} onImageClick={this.props.onImageClick}/>);
          } else {
            imageRow.push(<PassImage key={img} img={`http://localhost:7000/configs/image/${img}`} alias={img}
                                     isTesting={true} onImageClick={this.props.onImageClick}/>);
          }
        }
        matrix.push(
          <div key={i}>
            {imageRow}
          </div>
        );
      }
    }


    if (this.props.noneEnabled) {
      matrix.push(
        <div key={(i + 1)}>
          <Button bsSize={"large"} bsStyle={"primary"} className={classes.imageNone} onClick={this.props.onButtonClick} >None of my pass-images are
            displayed here</Button>
        </div>
      );
    }

    return (
      <div className={classes.matrix}>
        <div className={classes.matrixStatus}>
          <h1>Verification Stage {this.props.currentStage} of {this.props.totalStages}</h1>
        </div>
        {matrix}
      </div>
    );
  }
}
