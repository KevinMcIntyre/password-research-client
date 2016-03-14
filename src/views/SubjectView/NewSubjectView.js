import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Input } from 'react-bootstrap';
import Select from 'react-select';
import { actions as viewActions } from '../../redux/modules/newSubjectView';
import classes from './SubjectView.scss';
import { isBlank, isEmail, isValidDate } from '../../utils/validation.js'

const mapStateToProps = (state) => ({
  viewState: state.newSubjectView
});

export class NewSubjectView extends React.Component {
  static propTypes = {
    setErrorFields: PropTypes.func.isRequired,
    saveProfile: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.clearForm = this.clearForm.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.validateProfile = this.validateProfile.bind(this);
  }

  clearForm() {
    this.props.setErrorFields([]);
    const fields = ['firstName', 'lastName', 'email', 'birthday'];
    fields.map(field => {
      this.refs[field].refs['input'].value = '';
    });
  }

  handleSave() {
    let profile = {
      firstName: this.refs.firstName.getValue(),
      lastName: this.refs.lastName.getValue(),
      email: this.refs.email.getValue(),
      birthday: this.refs.birthday.getValue()
    };
    const issues = this.validateProfile(profile);
    if (issues.length > 0) {
      this.props.setErrorFields(issues);
    } else {
      this.props.saveProfile(profile);
      this.clearForm();
    }
  }

  validateProfile(profile) {
    let issues = [];
    if (isBlank(profile.firstName)) {
      issues.push('firstName');
    }
    if (isBlank(profile.lastName)) {
      issues.push('lastName')
    }
    if (isBlank(profile.email) || !isEmail(profile.email)) {
      issues.push('email')
    }
    if (isBlank(profile.birthday) || !isValidDate(profile.birthday)) {
      issues.push('birthday')
    }
    return issues;
  }

  render() {
    return (
      <div className='container text-center'>
        <br/>
        <br/>
        <h3>New Subject</h3>
        <br/>
        <form className={classes.newUserForm}>
          <div className={classes.formDiv}>
            <Input
              ref='firstName'
              type='text'
              label='First Name'
              placeholder='Enter First Name'
              className={classes.textField}
              bsStyle={this.props.viewState.get('errorFields').indexOf('firstName') > -1 ? 'error' : undefined}
              />
            {
              this.props.viewState.get('errorFields').indexOf('firstName') > -1 ?
                <p className={classes.errorMsg}>This field is required.</p> : <span></span>
            }
            <Input
              ref='lastName'
              type='text'
              label='Last Name'
              placeholder='Enter Last Name'
              className={classes.textField}
              bsStyle={this.props.viewState.get('errorFields').indexOf('lastName') > -1 ? 'error' : undefined}
              />
            {
              this.props.viewState.get('errorFields').indexOf('lastName') > -1 ?
                <p className={classes.errorMsg}>This field is required.</p> : <span></span>
            }
            <Input
              ref='email'
              type='email'
              label='E-Mail'
              placeholder='Enter Email Address'
              className={classes.textField}
              bsStyle={this.props.viewState.get('errorFields').indexOf('email') > -1 ? 'error' : undefined}
              />
            {
              this.props.viewState.get('errorFields').indexOf('email') > -1 ?
                <p className={classes.errorMsg}>A valid e-mail address must be entered.</p> : <span></span>
            }
            <Input
              ref='birthday'
              type='text'
              label='Date of Birth'
              placeholder='MM/DD/YYYY'
              className={classes.textField}
              bsStyle={this.props.viewState.get('errorFields').indexOf('birthday') > -1 ? 'error' : undefined}
              />
            {
              this.props.viewState.get('errorFields').indexOf('birthday') > -1 ?
                <p className={classes.errorMsg}>A date must be entered in MM/DD/YYYY format.</p> : <span></span>
            }
            <div className={classes.formButtons}>
              <Button className={classes.saveButton} bsStyle={'success'} onClick={this.handleSave}>Save Subject</Button>
              <Button onClick={this.clearForm}>Clear Form</Button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, viewActions)(NewSubjectView);
