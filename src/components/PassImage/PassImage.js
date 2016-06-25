import React from 'react';
import classes from './PassImage.scss';

export default class PassImage extends React.Component {
  constructor() {
    super();
  }

  shouldComponentUpdate(nextProps) {
    return this.props.img !== nextProps.img;
  }

  render() {
    let passImageBody;
    if (this.props.img.indexOf('user-img') > -1) {
      passImageBody = (<img className={classes.testPassImage}
                            src={'http://localhost:7000/assets/img/participant-image.jpeg'}/>);
    } else if (this.props.isTesting) {
      passImageBody = (<img className={classes.testPassImage}
                            src={this.props.img}/>);
    } else {
      passImageBody = (<img className={classes.passImage}
                            src={this.props.img}/>);
    }
    if (this.props.onImageClick) {
      return (
        <div className={classes.passImageBase} onClick={this.props.onImageClick.bind(null, this.props.alias)}>
          {passImageBody}
        </div>
      );
    } else {
      return (
        <div className={classes.passImageBase}>
          {passImageBody}
        </div>
      );
    }

  }
}
