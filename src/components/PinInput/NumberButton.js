import React from 'react';
import classes from './PinInput.scss';

export default class NumberButton extends React.Component {
  constructor() {
    super();
    this.letters = this.letters.bind(this);
  }

  letters() {
    let letters;
    switch (this.props.number) {
      case 2: {
        letters = <span className={classes.buttonLetters}>ABC</span>;
        break;
      }
      case 3: {
        letters = <span className={classes.buttonLetters}>DEF</span>;
        break;
      }
      case 4: {
        letters = <span className={classes.buttonLetters}>GHI</span>;
        break;
      }
      case 5: {
        letters = <span className={classes.buttonLetters}>JKL</span>;
        break;
      }
      case 6: {
        letters = <span className={classes.buttonLetters}>MNO</span>;
        break;
      }
      case 7: {
        letters = <span className={classes.buttonLetters}>PQRS</span>;
        break;
      }
      case 8: {
        letters = <span className={classes.buttonLetters}>TUV</span>;
        break;
      }
      case 9: {
        letters = <span className={classes.buttonLetters}>WXYZ</span>;
        break;
      }
      default: {
        letters = <span className={classes.emptyLetters}></span>;
        break;
      }
    }

    return letters;
  }

  render() {
    return (
      <span className={classes.numberButtonBase}>
        <button className={classes.numberButton} onClick={this.props.click.bind(undefined, this.props.number)}>
          {this.letters()}
          <span className={classes.buttonNumber}>
              {this.props.number}
            </span>
        </button>
      </span>
    );
  }
}
