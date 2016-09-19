import React from 'react';
import classes from './PasswordInput.scss';
import Icon from 'react-fa';

export default class PasswordInput extends React.Component {
  constructor() {
    super();
    this.state = {
      showPassword: false,
      password: ''
    }
  }

  getValue() {
    return this.state.password;
  }

  clear() {
    this.setState({password: ''})
  }

  render() {
    return (
      <div>
        <input
          className={classes.passwordField}
          type={this.state.showPassword ? 'text' : 'password'}
          value={this.state.password}
          onChange={(e) => {
            this.setState({password: e.target.value});
          }}
        />
        <Icon
          name='eye'
          className={classes.eyeButton}
          onMouseEnter={() => {
            this.setState({showPassword: true});
          }}
          onMouseLeave={() => {
            this.setState({showPassword: false});
          }}
        />
      </div>
    );
  }
}
