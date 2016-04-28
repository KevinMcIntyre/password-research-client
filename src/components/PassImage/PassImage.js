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
    if (this.props.isTesting) {
      passImageBody = (<img className={classes.testPassImage}
           src={this.props.img} />);
    } else {
      passImageBody = (<img className={classes.passImage}
           src={this.props.img} />);
    }
    return (
      <div className={classes.passImageBase}>
        {passImageBody}
      </div>
    );
  }
}
