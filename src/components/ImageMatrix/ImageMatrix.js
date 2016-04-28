import React from 'react';
import { Button } from 'react-bootstrap';
import PassImage from '../PassImage/PassImage.js';
import TestImage from './01.jpg';
import classes from './ImageMatrix.scss';

export default class ImageMatrix extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
    return (this.props.matrix != nextProps.matrix || this.props.matrix.get("1").get("1") !== nextProps.matrix.get("1").get("1"));
  }

  render() {
    let matrix = [];
    if (this.props.matrix != undefined) {
      for (var i = 1; i <= this.props.rows; i++) {
        let imageRow = [];
        for (let j = 1; j <= this.props.columns; j++) {
          let imgKey = i.toString() + j.toString();
          let img = this.props.matrix.get(i.toString()).get(j.toString());
          imageRow.push(<PassImage key={imgKey} ident={imgKey} img={"http://localhost:7000/random/image/" + img} isTesting={true}/>);
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
          <Button bsSize={"large"} bsStyle={"primary"} className={classes.imageNone}>None of my pass-images are displayed here</Button>
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
