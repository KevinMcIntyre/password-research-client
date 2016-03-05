import React from 'react';
import { Button } from 'react-bootstrap';
import PassImage from '../PassImage/PassImage.js';
import TestImage from './01.jpg';
import classes from './ImageMatrix.scss';

export default class ImageMatrix extends React.Component {
  render() {
    let matrix = [];
    for (var i = 0; i < this.props.rows; i++) {
      let imageRow = [];
      for (var j = 0; j < this.props.columns; j++) {
        var imgKey = i.toString() + j.toString();
        imageRow.push(<PassImage key={imgKey} ident={imgKey} img={TestImage} isTesting={true}/>);
      }
      matrix.push(
        <div key={i}>
          {imageRow}
        </div>
      );
    }

    if (this.props.noneEnabled) {
      matrix.push(
        <div key={(i+1)}>
          <Button bsSize={"large"} bsStyle={"primary"} className={classes.imageNone}>None of my pass-images are displayed here</Button>
        </div>
      );
    }

    return (
      <div className={classes.matrix}>
        <div className={classes.matrixStatus}>
          <h1>Verification Stage 1 of 6</h1>
        </div>
        {matrix}
      </div>
    );
  }
}
