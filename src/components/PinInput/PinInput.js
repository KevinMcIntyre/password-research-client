import React from 'react';
import NumberButton from './NumberButton.js';
import classes from './PinInput.scss';

export default class PinInput extends React.Component {
  constructor() {
    super();
    this.keyPress = this.keyPress.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.backspace = this.backspace.bind(this);
    this.clear = this.clear.bind(this);
    this.setState = this.setState.bind(this);
    this.state = {
      pinNumber: ''
    };
  }

  clear() {
    this.setState({
      pinNumber: ''
    });
  }

  getValue() {
    return this.state.pinNumber;
  }

  inputHandler(e) {
    const numbersOnly = new RegExp('^[0-9]*$');
    if (numbersOnly.test(e.target.value)) {
      this.setState({
        pinNumber: e.target.value
      });
    }
  }

  keyPress(number) {
    this.setState({
      pinNumber: this.state.pinNumber.concat(number.toString())
    });
  }

  backspace() {
    this.setState({
      pinNumber: this.state.pinNumber.substring(0, this.state.pinNumber.length - 1)
    });
  }

  render() {
    let numberPad = [];
    let key = 1;
    for (var i = 0; i < 3; i++) {
      let numberRow = [];
      for (var j = 0; j < 3; j++) {
        numberRow.push(<NumberButton click={this.keyPress} key={key} number={key} />);
        key++;
      }
      numberPad.push(
        <div className={classes.numberRow} key={i}>
          {numberRow}
        </div>
      );
    }
    let numberRow = [];
    numberRow.push(<NumberButton click={this.clear} key={-1} number={'CLR'} />);
    numberRow.push(<NumberButton click={this.keyPress} key={0} number={0} />);
    numberRow.push(<NumberButton click={this.backspace} key={-2} number={'DEL'} />);
    numberPad.push(
      <div key={5}>
        {numberRow}
      </div>
    );
    return (
      <div className={classes.matrix}>
        <input onChange={this.inputHandler.bind(this)} className={classes.pinField} type='password' value={this.state.pinNumber} />
        {numberPad}
      </div>
    );
  }
}
